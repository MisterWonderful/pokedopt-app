-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'admin');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('common', 'uncommon', 'rare', 'legendary');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('placed', 'shipped', 'delivered', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "poke_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "middle" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "types" TEXT[],
    "rarity" "Rarity" NOT NULL,
    "hp" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "donation" DECIMAL(10,2) NOT NULL,
    "backstory" TEXT NOT NULL,
    "wear" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "birth_month" TEXT NOT NULL,
    "birth_year" TEXT NOT NULL,
    "sprite" TEXT NOT NULL,
    "sprite_pixel" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_num" TEXT NOT NULL,
    "user_id" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'placed',
    "placed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "donation" DECIMAL(10,2) NOT NULL,
    "shipping_fee" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "shelter_pref" TEXT NOT NULL DEFAULT 'auto',
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "shipping_name" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "shipping_city" TEXT NOT NULL,
    "shipping_zip" TEXT NOT NULL,
    "shipping_country" TEXT NOT NULL DEFAULT 'United States',
    "stripe_payment_intent_id" TEXT,
    "stripe_customer_id" TEXT,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price_at" DECIMAL(10,2) NOT NULL,
    "name_at" TEXT NOT NULL,
    "middle_at" TEXT NOT NULL,
    "last_at" TEXT NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shelters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "raised" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "helped" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shelters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_num_key" ON "orders"("order_num");

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_payment_intent_id_key" ON "orders"("stripe_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "shelters_name_key" ON "shelters"("name");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

