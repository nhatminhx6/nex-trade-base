/// <reference path="../pb_data/types.d.ts" />

const buyerOrAdmin = "created_by = @request.auth.id || @request.auth.role = 'admin'";
const requestOwnerOrAdmin = "request.created_by = @request.auth.id || @request.auth.role = 'admin'";

migrate((app) => {
  // PocketBase creates the default users auth collection with each new database.
  const users = app.findCollectionByNameOrId("users");
  users.listRule = "id = @request.auth.id || @request.auth.role = 'admin'";
  users.viewRule = "id = @request.auth.id || @request.auth.role = 'admin'";
  // Public registration always creates a buyer. Admin and verification fields are protected.
  users.createRule = "role = 'buyer'";
  users.updateRule = "@request.auth.role = 'admin' || (id = @request.auth.id && role = @request.auth.role && is_verified = @request.auth.is_verified)";
  users.deleteRule = "@request.auth.role = 'admin'";
  users.authRule = "";
  users.manageRule = "id = @request.auth.id || @request.auth.role = 'admin'";
  [
    new TextField({ name: "name" }),
    new TextField({ name: "phone" }),
    new TextField({ name: "company_name" }),
    new SelectField({ name: "role", values: ["buyer", "supplier", "admin"], maxSelect: 1 }),
    new FileField({ name: "avatar", maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"] }),
    new BoolField({ name: "is_verified", default: false }),
  ].forEach((field) => users.fields.add(field));
  app.save(users);

  const sourcingRequests = new Collection({
    type: "base",
    name: "sourcing_requests",
  });
  [
    new TextField({ name: "title", required: true }),
    new TextField({ name: "product_name", required: true }),
    new SelectField({ name: "category", values: ["fruit", "vegetable", "seafood", "coffee", "rice", "cashew", "spice", "other"], maxSelect: 1 }),
    new TextField({ name: "quantity" }), new TextField({ name: "target_country" }), new TextField({ name: "budget_range" }),
    new EditorField({ name: "description" }),
    new SelectField({ name: "status", values: ["draft", "submitted", "reviewing", "sourcing", "quoted", "completed", "cancelled"], maxSelect: 1 }),
    new RelationField({ name: "created_by", collectionId: users.id, maxSelect: 1, required: true, cascadeDelete: true }),
    new FileField({ name: "attachments", maxSelect: 10, maxSize: 10485760 }),
  ].forEach((field) => sourcingRequests.fields.add(field));
  sourcingRequests.listRule = buyerOrAdmin;
  sourcingRequests.viewRule = buyerOrAdmin;
  sourcingRequests.createRule = "@request.auth.id != '' && created_by = @request.auth.id";
  sourcingRequests.updateRule = buyerOrAdmin;
  sourcingRequests.deleteRule = buyerOrAdmin;
  app.save(sourcingRequests);

  const supplierLeads = new Collection({
    type: "base",
    name: "supplier_leads",
  });
  [
    new RelationField({ name: "request", collectionId: sourcingRequests.id, maxSelect: 1, required: true, cascadeDelete: true }),
    new TextField({ name: "supplier_name", required: true }), new TextField({ name: "contact_name" }), new TextField({ name: "phone" }),
    new EmailField({ name: "email" }), new TextField({ name: "country" }), new TextField({ name: "address" }), new URLField({ name: "website" }),
    new TextField({ name: "quoted_price" }), new TextField({ name: "moq" }), new EditorField({ name: "notes" }),
    new SelectField({ name: "status", values: ["new", "contacted", "verified", "rejected", "shortlisted"], maxSelect: 1 }),
    new RelationField({ name: "created_by", collectionId: users.id, maxSelect: 1, cascadeDelete: false }),
  ].forEach((field) => supplierLeads.fields.add(field));
  supplierLeads.listRule = requestOwnerOrAdmin;
  supplierLeads.viewRule = requestOwnerOrAdmin;
  supplierLeads.createRule = "@request.auth.role = 'admin'";
  supplierLeads.updateRule = "@request.auth.role = 'admin'";
  supplierLeads.deleteRule = "@request.auth.role = 'admin'";
  app.save(supplierLeads);

  const messages = new Collection({
    type: "base",
    name: "messages",
  });
  [
    new RelationField({ name: "request", collectionId: sourcingRequests.id, maxSelect: 1, required: true, cascadeDelete: true }),
    new RelationField({ name: "sender", collectionId: users.id, maxSelect: 1, required: true, cascadeDelete: true }),
    new TextField({ name: "content", required: true }), new FileField({ name: "attachments", maxSelect: 10, maxSize: 10485760 }),
  ].forEach((field) => messages.fields.add(field));
  messages.listRule = requestOwnerOrAdmin;
  messages.viewRule = requestOwnerOrAdmin;
  messages.createRule = "@request.auth.id != '' && (request.created_by = @request.auth.id || @request.auth.role = 'admin') && sender = @request.auth.id";
  messages.updateRule = "@request.auth.role = 'admin'";
  messages.deleteRule = "@request.auth.role = 'admin'";
  app.save(messages);

  const payments = new Collection({
    type: "base",
    name: "payments",
  });
  [
    new RelationField({ name: "user", collectionId: users.id, maxSelect: 1, required: true, cascadeDelete: true }),
    new RelationField({ name: "request", collectionId: sourcingRequests.id, maxSelect: 1, cascadeDelete: false }),
    new NumberField({ name: "amount", required: true }),
    new SelectField({ name: "currency", values: ["VND", "USD"], maxSelect: 1 }),
    new SelectField({ name: "status", values: ["pending", "paid", "failed", "refunded"], maxSelect: 1 }), new TextField({ name: "note" }),
  ].forEach((field) => payments.fields.add(field));
  payments.listRule = "user = @request.auth.id || @request.auth.role = 'admin'";
  payments.viewRule = "user = @request.auth.id || @request.auth.role = 'admin'";
  payments.createRule = "@request.auth.role = 'admin'";
  payments.updateRule = "@request.auth.role = 'admin'";
  payments.deleteRule = "@request.auth.role = 'admin'";
  app.save(payments);
}, (app) => {
  ["payments", "messages", "supplier_leads", "sourcing_requests", "users"].forEach((name) => {
    app.delete(app.findCollectionByNameOrId(name));
  });
});
