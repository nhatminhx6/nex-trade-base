migrate((app) => {
  const listings = app.findCollectionByNameOrId("approved_listings");
  listings.listRule = "";
  listings.viewRule = "";
  listings.deleteRule = "@request.auth.role = 'admin' || request.created_by = @request.auth.id";
  app.save(listings);
}, (app) => {
  const listings = app.findCollectionByNameOrId("approved_listings");
  listings.listRule = "@request.auth.role = 'admin' || request.status = 'approved'";
  listings.viewRule = "@request.auth.role = 'admin' || request.status = 'approved'";
  listings.deleteRule = "@request.auth.role = 'admin'";
  app.save(listings);
});
