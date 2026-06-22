CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserFavoriteWord" (
	"id" uuid PRIMARY KEY,
	"userId" text NOT NULL,
	"word" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "UserFavoriteWord_userId_word_key" UNIQUE("userId","word")
);

CREATE TABLE IF NOT EXISTS "UserSearchHistory" (
	"id" uuid PRIMARY KEY,
	"userId" text NOT NULL,
	"word" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "Word" (
	"id" text PRIMARY KEY,
	"text" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_pkey" ON "User" ("id");

CREATE UNIQUE INDEX IF NOT EXISTS "UserFavoriteWord_pkey" ON "UserFavoriteWord" ("id");
CREATE INDEX IF NOT EXISTS "UserFavoriteWord_userId_createdAt_idx" ON "UserFavoriteWord" ("userId","createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "UserFavoriteWord_userId_word_key" ON "UserFavoriteWord" ("userId","word");

CREATE UNIQUE INDEX IF NOT EXISTS "UserSearchHistory_pkey" ON "UserSearchHistory" ("id");
CREATE INDEX IF NOT EXISTS "UserSearchHistory_userId_createdAt_idx" ON "UserSearchHistory" ("userId","createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "Word_pkey" ON "Word" ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "Word_text_key" ON "Word" ("text");