migrate((app) => {
  const requests = app.findCollectionByNameOrId("sourcing_requests");
  [new SelectField({ name: "trade_intent", values: ["buy", "sell"], maxSelect: 1, required: true }), new TextField({ name: "needed_at", required: true })].forEach((field) => requests.fields.add(field));
  app.save(requests);

  const listings = app.findCollectionByNameOrId("approved_listings");
  [new SelectField({ name: "trade_intent", values: ["buy", "sell"], maxSelect: 1, required: true }), new TextField({ name: "needed_at", required: true })].forEach((field) => listings.fields.add(field));
  app.save(listings);
}, (app) => {
  ["sourcing_requests", "approved_listings"].forEach((collectionName) => {
    const collection = app.findCollectionByNameOrId(collectionName);
    ["trade_intent", "needed_at"].forEach((name) => collection.fields.removeByName(name));
    app.save(collection);
  });
});
