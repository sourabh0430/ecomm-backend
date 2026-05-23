import { mysqlTable, varchar, text, boolean, timestamp, int, primaryKey, mysqlEnum } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const roles = mysqlTable("roles", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const permissions = mysqlTable("permissions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const userRoles = mysqlTable("user_roles", {
  user_id: varchar("user_id", { length: 36 }).notNull(),
  role_id: varchar("role_id", { length: 36 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.user_id, table.role_id] }),
}));

export const rolePermissions = mysqlTable("role_permissions", {
  role_id: varchar("role_id", { length: 36 }).notNull(),
  permission_id: varchar("permission_id", { length: 36 }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.role_id, table.permission_id] }),
}));

export const refreshTokens = mysqlTable("refresh_tokens", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  token: varchar("token", { length: 500 }).notNull().unique(),
  user_id: varchar("user_id", { length: 36 }).notNull(),
  expires_at: timestamp("expires_at").notNull(),
  revoked_at: timestamp("revoked_at"),
  created_at: timestamp("created_at").defaultNow(),
});

export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  token: varchar("token", { length: 255 }).notNull().unique(),
  user_id: varchar("user_id", { length: 36 }).notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});




import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
  refreshTokens: many(refreshTokens),
  passwordResetTokens: many(passwordResetTokens),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
  permissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.user_id], references: [users.id] }),
  role: one(roles, { fields: [userRoles.role_id], references: [roles.id] }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.role_id], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permission_id], references: [permissions.id] }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.user_id], references: [users.id] }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.user_id], references: [users.id] }),
}));
