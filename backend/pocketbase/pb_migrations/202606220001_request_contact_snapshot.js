migrate((app) => {
  const requests = app.findCollectionByNameOrId("sourcing_requests");
  [
    new TextField({ name: "contact_name" }),
    new TextField({ name: "contact_phone" }),
    new EmailField({ name: "contact_email" }),
  ].forEach((field) => requests.fields.add(field));
  app.save(requests);
}, (app) => {
  const requests = app.findCollectionByNameOrId("sourcing_requests");
  ["contact_name", "contact_phone", "contact_email"].forEach((name) => requests.fields.removeByName(name));
  app.save(requests);
});
