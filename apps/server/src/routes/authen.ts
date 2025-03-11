import { Hono } from "hono";
import { Variables } from "hono/types";

const app = new Hono<{Bindings:Env,Variables:Variables}>();