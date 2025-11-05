// convex/tasks.ts

import { mutation, query } from "./_generated/server";

import { v } from "convex/values";

// Get all tasks
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Get tasks by completion status
export const getByStatus = query({
  args: {
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("all")),
  },
  handler: async (ctx, args) => {
    let tasks;
    if (args.status === "all") {
      tasks = await ctx.db.query("tasks").collect();
    } else {
      const isCompleted = args.status === "completed";
      tasks = await ctx.db
        .query("tasks")
        .filter((q) => q.eq(q.field("isCompleted"), isCompleted))
        .collect();
    }
    // Sort tasks by order field if it exists
    return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  },
});

// Add a new task
export const add = mutation({
  args: {
    text: v.string(), // Changed from 'name' to 'text'
    isCompleted: v.optional(v.boolean()), // Changed from 'status' to 'isCompleted'
  },
  handler: async (ctx, args) => {
    // Get the current highest order value
    const tasks = await ctx.db.query("tasks").collect();
    const maxOrder = tasks.reduce((max, task) => Math.max(max, task.order || 0), 0);
    
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: args.isCompleted || false,
      order: maxOrder + 1,
    });
    return taskId;
  },
});

// Update a task's completion status
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    isCompleted: v.boolean(), // Changed from 'status' to 'isCompleted'
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isCompleted: args.isCompleted });
  },
});

// Delete a task
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Reorder tasks
export const reorderTasks = mutation({
  args: {
    taskIds: v.array(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    // Update each task with its new order
    for (let i = 0; i < args.taskIds.length; i++) {
      await ctx.db.patch(args.taskIds[i], { order: i });
    }
  },
});