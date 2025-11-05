// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),        // Change from 'name' to 'text'
    isCompleted: v.boolean(), // Change from 'status' to 'isCompleted'
    order: v.optional(v.number()), // Make order optional since it might not exist
  }),
});