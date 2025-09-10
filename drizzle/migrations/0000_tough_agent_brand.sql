CREATE TYPE "public"."project_status" AS ENUM('open', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "chance_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "chance_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "chance_heartbeat_comment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"heartbeat_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "chance_heartbeat_like" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"heartbeat_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chance_heartbeat" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"image_url" varchar(255),
	"user_id" varchar(255) NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "chance_project_member" (
	"project_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	CONSTRAINT "chance_project_member_project_id_user_id_pk" PRIMARY KEY("project_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "chance_project_vote" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"vote_type" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chance_project" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"impact" text NOT NULL,
	"team_size" integer NOT NULL,
	"effort" varchar(100) NOT NULL,
	"people_influenced" integer,
	"type_of_people" varchar(255),
	"required_tools" text[] DEFAULT '{}'::text[],
	"action_plan" text[] DEFAULT '{}'::text[],
	"collaboration" text,
	"likes" integer DEFAULT 0 NOT NULL,
	"creator_id" varchar(255) NOT NULL,
	"status" "project_status" DEFAULT 'open' NOT NULL,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "chance_projects_completed" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"completed_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chance_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chance_sharing_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"share_type" varchar(50) NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chance_spotlight" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chance_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"username" varchar(255),
	"profile_image_url" varchar(255),
	"school" varchar(255),
	"bio" text,
	"instagram" varchar(255),
	"whatsapp_number" varchar(20),
	"profile_completed" boolean DEFAULT false NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"influence" integer DEFAULT 0 NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chance_user_email_unique" UNIQUE("email"),
	CONSTRAINT "chance_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "chance_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "chance_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "chance_account" ADD CONSTRAINT "chance_account_userId_chance_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_heartbeat_comment" ADD CONSTRAINT "chance_heartbeat_comment_heartbeat_id_chance_heartbeat_id_fk" FOREIGN KEY ("heartbeat_id") REFERENCES "public"."chance_heartbeat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_heartbeat_comment" ADD CONSTRAINT "chance_heartbeat_comment_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_heartbeat_like" ADD CONSTRAINT "chance_heartbeat_like_heartbeat_id_chance_heartbeat_id_fk" FOREIGN KEY ("heartbeat_id") REFERENCES "public"."chance_heartbeat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_heartbeat_like" ADD CONSTRAINT "chance_heartbeat_like_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_heartbeat" ADD CONSTRAINT "chance_heartbeat_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_project_member" ADD CONSTRAINT "chance_project_member_project_id_chance_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."chance_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_project_member" ADD CONSTRAINT "chance_project_member_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_project_vote" ADD CONSTRAINT "chance_project_vote_project_id_chance_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."chance_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_project_vote" ADD CONSTRAINT "chance_project_vote_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_project" ADD CONSTRAINT "chance_project_creator_id_chance_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."chance_user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_projects_completed" ADD CONSTRAINT "chance_projects_completed_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_projects_completed" ADD CONSTRAINT "chance_projects_completed_project_id_chance_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."chance_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_session" ADD CONSTRAINT "chance_session_userId_chance_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_sharing_logs" ADD CONSTRAINT "chance_sharing_logs_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chance_spotlight" ADD CONSTRAINT "chance_spotlight_user_id_chance_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chance_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "chance_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "heartbeat_comment_heartbeat_id_idx" ON "chance_heartbeat_comment" USING btree ("heartbeat_id");--> statement-breakpoint
CREATE INDEX "heartbeat_comment_user_id_idx" ON "chance_heartbeat_comment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "heartbeat_like_heartbeat_id_idx" ON "chance_heartbeat_like" USING btree ("heartbeat_id");--> statement-breakpoint
CREATE INDEX "heartbeat_like_user_id_idx" ON "chance_heartbeat_like" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "heartbeat_user_id_idx" ON "chance_heartbeat" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "heartbeat_created_at_idx" ON "chance_heartbeat" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "project_member_project_id_idx" ON "chance_project_member" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_member_user_id_idx" ON "chance_project_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "project_vote_project_id_idx" ON "chance_project_vote" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_vote_user_id_idx" ON "chance_project_vote" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "project_creator_id_idx" ON "chance_project" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "project_title_idx" ON "chance_project" USING btree ("title");--> statement-breakpoint
CREATE INDEX "project_category_idx" ON "chance_project" USING btree ("category");--> statement-breakpoint
CREATE INDEX "project_status_idx" ON "chance_project" USING btree ("status");--> statement-breakpoint
CREATE INDEX "projects_completed_user_id_idx" ON "chance_projects_completed" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_completed_project_id_idx" ON "chance_projects_completed" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "chance_session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sharing_logs_user_id_idx" ON "chance_sharing_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sharing_logs_content_type_idx" ON "chance_sharing_logs" USING btree ("content_type");--> statement-breakpoint
CREATE INDEX "spotlight_user_id_idx" ON "chance_spotlight" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "chance_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_username_idx" ON "chance_user" USING btree ("username");