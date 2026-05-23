-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "card_number" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "illustrator" TEXT,
ADD COLUMN     "image_url_1" TEXT,
ADD COLUMN     "image_url_2" TEXT,
ADD COLUMN     "original_title" TEXT,
ADD COLUMN     "set_name" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "stage" TEXT,
ADD COLUMN     "year" TEXT,
ALTER COLUMN "poke_id" SET DEFAULT 0,
ALTER COLUMN "middle" SET DEFAULT '',
ALTER COLUMN "last" SET DEFAULT '',
ALTER COLUMN "hp" SET DEFAULT 0,
ALTER COLUMN "grade" SET DEFAULT '',
ALTER COLUMN "backstory" SET DEFAULT '',
ALTER COLUMN "wear" SET DEFAULT '',
ALTER COLUMN "birthday" SET DEFAULT '',
ALTER COLUMN "birth_month" SET DEFAULT '',
ALTER COLUMN "birth_year" SET DEFAULT '',
ALTER COLUMN "sprite" SET DEFAULT '',
ALTER COLUMN "sprite_pixel" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "cards_sku_key" ON "cards"("sku");

