migrate((app) => {
  const requests = app.findCollectionByNameOrId("sourcing_requests");
  const status = requests.fields.getByName("status");
  status.values = ["draft", "submitted", "reviewing", "sourcing", "quoted", "completed", "cancelled", "approved", "rejected"];
  app.save(requests);

  const listings = new Collection({ type: "base", name: "approved_listings" });
  [
    new RelationField({ name: "request", collectionId: requests.id, maxSelect: 1, required: true, cascadeDelete: true }),
    new TextField({ name: "title", required: true }),
    new TextField({ name: "product_name", required: true }),
    new SelectField({ name: "category", values: ["fruit", "vegetable", "seafood", "coffee", "rice", "cashew", "spice", "other"], maxSelect: 1 }),
    new TextField({ name: "quantity" }), new TextField({ name: "target_country" }), new TextField({ name: "budget_range" }),
    new EditorField({ name: "description" }),
  ].forEach((field) => listings.fields.add(field));
  listings.listRule = "";
  listings.viewRule = "";
  listings.createRule = "@request.auth.role = 'admin'";
  listings.updateRule = "@request.auth.role = 'admin'";
  listings.deleteRule = "@request.auth.role = 'admin'";
  app.save(listings);
}, (app) => {
  app.delete(app.findCollectionByNameOrId("approved_listings"));
  const requests = app.findCollectionByNameOrId("sourcing_requests");
  requests.fields.getByName("status").values = ["draft", "submitted", "reviewing", "sourcing", "quoted", "completed", "cancelled"];
  app.save(requests);
});
