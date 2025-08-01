import { Hono } from "hono";
import { requestId } from 'hono/request-id'
import { authMiddleware } from "../middleware/authMiddleware";
import { drizzle } from "drizzle-orm/d1";
import { storageTable } from "../../db/schema/storage";
import { and, count, desc, eq, is, isNull } from "drizzle-orm";
import { appMiddleware } from "../middleware/appMiddleware";

export const appFileRoute = new Hono<{ Bindings: Env }>()
    .use(requestId())
    .get("/list", appMiddleware, async (c) => {
        try {
            const perPage = parseInt(c.req.param("perPage") || "10")
            const page = parseInt(c.req.param("page") || "1")
            const db = drizzle(c.env.DB)
            const allFilesCount = await db.select({ count: count() }).from(storageTable).where(and(eq(storageTable.accountId, c.get("jwtPayload").sub), isNull(storageTable.deletedAt)))
            const files = await db.select()
                .from(storageTable)
                .where(and(eq(storageTable.accountId, c.get("jwtPayload").sub), isNull(storageTable.deletedAt), eq(storageTable.accountType, "app")))
                .orderBy(desc(storageTable.createdAt))
                .limit(perPage)
                .offset((page - 1) * perPage)
            return c.json({
                files: files,
                pagination: {
                    total: allFilesCount[0].count,
                    perPage,
                    page
                }
            });
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    })
    .get("/path/:path", async (c) => {
        try {
            const storage = c.env.BUCKET
            const path = c.req.param("path")
            const db = drizzle(c.env.DB)
            const file_data = await db.select().from(storageTable).where(eq(storageTable.path, path))
            if (file_data.length === 0) {
                return c.json({ message: "File not found" }, 404);
            }
            if (file_data[0].deletedAt) {
                return c.json({ message: "File was delete" }, 404);
            }
            const res = await storage.get(path)
            if (!res) {
                return c.json({ message: "File not found" }, 404);
            }
            return c.body(res?.body);
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    })
    .post("/", appMiddleware, async (c) => {
        try {
            const body = await c.req.parseBody()
            const file: File | string = body['file']
            if (!file) {
                return c.json({ message: "No file provided" }, 400);
            }
            const storage = c.env.BUCKET
            const db = drizzle(c.env.DB)
            if (file instanceof File) {
                const path = "user-" + c.get("requestId") + new URLSearchParams(file.name).toString()
                const res = await storage.put(path, file)
                await db.insert(storageTable).values({
                    accountId: c.get("jwtPayload").sub,
                    fileName: file.name,
                    path,
                    accountType: "app"
                })
                return c.json({ path });
            }
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
    })
    .get("delete/:id", appMiddleware, async (c) => {
        try {
            const storage = c.env.BUCKET
            const db = drizzle(c.env.DB)
            const id = c.req.param("id")
            const filePath = await db.select().from(storageTable).where(and(eq(storageTable.id, parseInt(id)), eq(storageTable.accountType, "app")))
            if (filePath.length === 0) {
                throw new Error("File not found")
            }
            const path = filePath[0].path
            const res = await storage.delete(path)
            await db.update(storageTable).set({ deletedAt: new Date() }).where(eq(storageTable.id, parseInt(id)))
            return c.json({ message: "File deleted" });
        }
        catch (e) {
            console.log(e);
            return c.json({ message: "Error", e }, 500);
        }
        
    }).get("/delete", async (c) => {
        try {
            const db = drizzle(c.env.DB)

            // จำกัดจำนวนไฟล์เพื่อป้องกัน memory limit
            const files = await db.select().from(storageTable)
                .where(and(
                    eq(storageTable.accountType, "app"),
                    eq(storageTable.fileName, "accord13.png")
                ))
                .limit(20000) // ลดจำนวนลงเพื่อประสิทธิภาพ

            if (files.length === 0) {
                return c.json({ message: "No files found to delete", deletedCount: 0 })
            }

            console.log(`Found ${files.length} files to delete`)

            let deletedCount = 0
            let failedCount = 0
            const errors = []

            // ลบไฟล์จาก bucket ทั้งหมดก่อน (batch operation)
            const bucketDeletePromises = files.map(async (file) => {
                try {
                    await c.env.BUCKET.delete(file.path)
                    return { success: true, fileId: file.id }
                } catch (error) {
                    return { success: false, fileId: file.id, error: error.message }
                }
            })

            const bucketResults = await Promise.allSettled(bucketDeletePromises)

            // อัปเดต database สำหรับไฟล์ที่ลบจาก bucket สำเร็จ
            const successfullyDeletedFiles = []

            for (let i = 0; i < bucketResults.length; i++) {
                const result = bucketResults[i]
                if (result.status === 'fulfilled' && result.value.success) {
                    successfullyDeletedFiles.push(files[i])
                } else {
                    failedCount++
                    const errorMsg = `Failed to delete file ${files[i].id} from bucket`
                    errors.push(errorMsg)
                    console.error(errorMsg)
                }
            }

            // อัปเดต database แบบ batch (ไม่ใช้ transaction)
            if (successfullyDeletedFiles.length > 0) {
                try {
                    const fileIds = successfullyDeletedFiles.map(file => file.id)

                    // อัปเดตทีละ 10 records เพื่อลด memory usage
                    const batchSize = 10
                    for (let i = 0; i < fileIds.length; i += batchSize) {
                        const batch = fileIds.slice(i, i + batchSize)

                        for (const fileId of batch) {
                            try {
                                await db.update(storageTable)
                                    .set({ deletedAt: new Date() })
                                    .where(eq(storageTable.id, fileId))
                                deletedCount++
                                console.log(`File ${fileId} marked as deleted in database`);
                                
                            } catch (dbError) {
                                failedCount++
                                errors.push(`Failed to update database for file ${fileId}: ${dbError.message}`)
                            }
                        }

                        // รอระหว่าง batch เพื่อลด memory pressure
                        if (i + batchSize < fileIds.length) {
                            await new Promise(resolve => setTimeout(resolve, 100))
                        }
                    }

                    console.log(`Successfully updated ${deletedCount} records in database`)

                } catch (dbError) {
                    console.error("Database batch update failed:", dbError)
                    errors.push(`Database batch update failed: ${dbError.message}`)
                }
            }

            // ส่งผลลัพธ์กลับ
            const result = {
                message: "Delete operation completed",
                totalFiles: files.length,
                deletedCount,
                failedCount,
                errors: errors.length > 0 ? errors.slice(0, 5) : undefined // แสดงแค่ 5 errors แรก
            }

            return c.json(result, deletedCount > 0 ? 200 : 207) // 207 = Multi-Status

        } catch (e) {
            console.error("Delete operation failed:", e)
            return c.json({
                message: "Delete operation failed",
                error: e.message || "Unknown error"
            }, 500)
        }
    })