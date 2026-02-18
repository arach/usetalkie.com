CREATE TABLE "reports" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"source" varchar(50) NOT NULL,
	"user_description" text,
	"system_info" jsonb NOT NULL,
	"apps_info" jsonb NOT NULL,
	"context_info" jsonb NOT NULL,
	"logs" jsonb NOT NULL,
	"performance" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "reports_source_idx" ON "reports" USING btree ("source");--> statement-breakpoint
CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");