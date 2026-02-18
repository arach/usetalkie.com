CREATE TYPE "public"."contact_status" AS ENUM('contact', 'active', 'churned');--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" "contact_status" DEFAULT 'contact' NOT NULL,
	"clerk_user_id" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"use_case" varchar(255),
	"source" varchar(255),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"resend_contact_id" varchar(255),
	"email_unsubscribed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"converted_at" timestamp with time zone,
	CONSTRAINT "contacts_email_unique" UNIQUE("email"),
	CONSTRAINT "contacts_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "feedback_threads" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"sender_email" varchar(255) NOT NULL,
	"feedback" varchar(5000) NOT NULL,
	"url" varchar(500),
	"user_agent" varchar(500),
	"replied" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contacts_email_idx" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contacts_clerk_user_id_idx" ON "contacts" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "contacts_status_idx" ON "contacts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_threads_created_at_idx" ON "feedback_threads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_threads_replied_idx" ON "feedback_threads" USING btree ("replied");