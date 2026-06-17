import { pgTable, serial, timestamp, varchar, text, integer, boolean, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const profiles = pgTable(
  "profiles",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    display_name: varchar("display_name", { length: 100 }),
    avatar_url: text("avatar_url"),
    bio: text("bio"),
    role: varchar("role", { length: 20 }).notNull().default("user"),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("profiles_email_idx").on(table.email),
    index("profiles_username_idx").on(table.username),
    index("profiles_role_idx").on(table.role),
  ]
);

export const papers = pgTable(
  "papers",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 500 }).notNull(),
    authors: text("authors").notNull(),
    doi: varchar("doi", { length: 255 }),
    pubmed_id: varchar("pubmed_id", { length: 50 }),
    journal: varchar("journal", { length: 255 }),
    publish_date: varchar("publish_date", { length: 20 }),
    abstract: text("abstract"),
    comment_count: integer("comment_count").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("papers_doi_idx").on(table.doi),
    index("papers_pubmed_id_idx").on(table.pubmed_id),
    index("papers_title_idx").on(table.title),
    index("papers_comment_count_idx").on(table.comment_count),
    index("papers_created_at_idx").on(table.created_at),
  ]
);

export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    paper_id: varchar("paper_id", { length: 36 }).notNull().references(() => papers.id, { onDelete: "cascade" }),
    user_id: varchar("user_id", { length: 36 }).references(() => profiles.id),
    parent_id: varchar("parent_id", { length: 36 }),
    content: text("content").notNull(),
    is_anonymous: boolean("is_anonymous").notNull().default(false),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("comments_paper_id_idx").on(table.paper_id),
    index("comments_user_id_idx").on(table.user_id),
    index("comments_parent_id_idx").on(table.parent_id),
    index("comments_status_idx").on(table.status),
    index("comments_created_at_idx").on(table.created_at),
  ]
);

export const donations = pgTable(
  "donations",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).references(() => profiles.id),
    amount: integer("amount").notNull(),
    donor_name: varchar("donor_name", { length: 100 }),
    is_anonymous: boolean("is_anonymous").notNull().default(false),
    message: text("message"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("donations_user_id_idx").on(table.user_id),
    index("donations_created_at_idx").on(table.created_at),
  ]
);
