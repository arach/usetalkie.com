CREATE TABLE IF NOT EXISTS "intents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"intent" varchar(255) NOT NULL,
	"message" text,
	"source" varchar(255),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "intents_email_idx" ON "intents" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "intents_intent_idx" ON "intents" USING btree ("intent");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "intents_created_at_idx" ON "intents" USING btree ("created_at");