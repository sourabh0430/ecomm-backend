import { db } from "./index";
import { users, roles, permissions, rolePermissions, userRoles } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Starting seeding process with Drizzle...");

  // 1. Create Permissions
  console.log("Seeding permissions...");
  const permissionsList = [
    { name: "manage_users", description: "Can create, update, and delete users" },
    { name: "view_admin_panel", description: "Can access the admin dashboard" },
    { name: "manage_content", description: "Can manage subjects and topics" },
    { name: "view_reports", description: "Can view analytics and reports" },
  ];

  for (const p of permissionsList) {
    await db.insert(permissions).values(p).onDuplicateKeyUpdate({ set: { description: p.description } });
  }

  // Get all permissions to link them later
  const allPermissions = await db.select().from(permissions);

  // 2. Create Roles
  console.log("Seeding roles and linking permissions...");
  const rolesList = [
    {
      name: "SUPER_ADMIN",
      description: "Full access to all system features",
      perms: ["manage_users", "view_admin_panel", "manage_content", "view_reports"],
    },
    {
      name: "SUPPORT_ADMIN",
      description: "Limited admin access for support",
      perms: ["view_admin_panel", "view_reports"],
    },
    {
      name: "WEBSITE_USER",
      description: "Standard user access",
      perms: [],
    },
  ];

  for (const r of rolesList) {
    await db.insert(roles).values({
      name: r.name,
      description: r.description,
    }).onDuplicateKeyUpdate({ set: { description: r.description } });

    const role = (await db.select().from(roles).where(eq(roles.name, r.name)))[0];

    // Link permissions
    for (const pName of r.perms) {
      const permission = allPermissions.find((p) => p.name === pName);
      if (permission) {
        await db.insert(rolePermissions).values({
          role_id: role.id,
          permission_id: permission.id,
        }).onDuplicateKeyUpdate({ set: { role_id: role.id } });
      }
    }
  }

  // 3. Create Super Admin User
  console.log("Creating initial Super Admin user...");
  const adminEmail = "admin@example.com";
  const adminPassword = "AdminPassword123!";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = (await db.select().from(users).where(eq(users.email, adminEmail)))[0];

  if (!existingAdmin) {
    const [insertedUser] = await db.insert(users).values({
      email: adminEmail,
      password: hashedPassword,
      name: "System Administrator",
    });
    
    // We need the ID. Drizzle with mysql2 insert doesn't return the object by default unless we select it
    const newUser = (await db.select().from(users).where(eq(users.email, adminEmail)))[0];
    const superAdminRole = (await db.select().from(roles).where(eq(roles.name, "SUPER_ADMIN")))[0];

    if (newUser && superAdminRole) {
      await db.insert(userRoles).values({
        user_id: newUser.id,
        role_id: superAdminRole.id,
      });
      console.log(`✅ Super Admin created: ${adminEmail} / ${adminPassword}`);
    }
  } else {
    console.log("Super Admin already exists.");
  }

  console.log("✅ Seeding completed successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
