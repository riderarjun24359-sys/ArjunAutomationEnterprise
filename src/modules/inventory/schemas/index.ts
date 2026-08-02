import { z } from "zod";

export const categoryFormSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string(),
});

export const productFormSchema = z.object({
    sku: z.string().min(2),
    name: z.string().min(2),
    description: z.string(),
    categoryId: z.string().optional(),
    unitOfMeasure: z.string().min(1),
    unitCost: z.number().min(0),
    unitPrice: z.number().min(0),
    reorderLevel: z.number().min(0),
});

export const warehouseFormSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    location: z.string(),
    managerName: z.string(),
});

export const supplierFormSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    email: z.string().email().or(z.literal("")),
    phone: z.string(),
    address: z.string(),
});

export const purchaseOrderFormSchema = z.object({
    supplierId: z.string().min(1),
    poNumber: z.string().min(2),
    notes: z.string(),
});

export const assetFormSchema = z.object({
    assetTag: z.string().min(2),
    name: z.string().min(2),
    category: z.string().min(1),
    serialNumber: z.string(),
    purchaseCost: z.number().min(0),
    warehouseId: z.string().optional(),
});

export const barcodeFormSchema = z.object({
    barcodeValue: z.string().min(3),
    barcodeType: z.string().min(1),
    productId: z.string().optional(),
    assetId: z.string().optional(),
});

export const adjustmentFormSchema = z.object({
    productId: z.string().min(1),
    warehouseId: z.string().min(1),
    quantityDelta: z.number(),
    reason: z.string(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;
export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;
export type AssetFormValues = z.infer<typeof assetFormSchema>;
export type BarcodeFormValues = z.infer<typeof barcodeFormSchema>;
export type AdjustmentFormValues = z.infer<typeof adjustmentFormSchema>;
