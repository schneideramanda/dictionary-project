CREATE SCHEMA "public";

CREATE TABLE "User" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "UserFavoriteWord" (
	"id" uuid PRIMARY KEY,
	"userId" text NOT NULL,
	"word" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "UserFavoriteWord_userId_word_key" UNIQUE("userId","word")
);

CREATE TABLE "UserSearchHistory" (
	"id" uuid PRIMARY KEY,
	"userId" text NOT NULL,
	"word" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "Word" (
	"id" text PRIMARY KEY,
	"text" text NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");
CREATE UNIQUE INDEX "User_pkey" ON "User" ("id");

CREATE UNIQUE INDEX "UserFavoriteWord_pkey" ON "UserFavoriteWord" ("id");
CREATE INDEX "UserFavoriteWord_userId_createdAt_idx" ON "UserFavoriteWord" ("userId","createdAt");
CREATE UNIQUE INDEX "UserFavoriteWord_userId_word_key" ON "UserFavoriteWord" ("userId","word");

CREATE UNIQUE INDEX "UserSearchHistory_pkey" ON "UserSearchHistory" ("id");
CREATE INDEX "UserSearchHistory_userId_createdAt_idx" ON "UserSearchHistory" ("userId","createdAt");

CREATE UNIQUE INDEX "Word_pkey" ON "Word" ("id");
CREATE UNIQUE INDEX "Word_text_key" ON "Word" ("text");