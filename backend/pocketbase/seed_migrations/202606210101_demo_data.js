/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const users = app.findCollectionByNameOrId("users");
  const requests = app.findCollectionByNameOrId("sourcing_requests");
  const leads = app.findCollectionByNameOrId("supplier_leads");

  const createUser = (email, name, role, companyName) => {
    const record = new Record(users);
    record.set("email", email);
    record.set("password", "Nex@1234");
    record.set("passwordConfirm", "Nex@1234");
    record.set("name", name);
    record.set("company_name", companyName);
    record.set("role", role);
    record.set("is_verified", true);
    record.setVerified(true);
    app.save(record);
    return record;
  };

  const buyer = createUser("buyer.demo@nextrade.local", "Demo Buyer", "buyer", "NexTrade Buyer Co.");
  const admin = createUser("admin.demo@nextrade.local", "Demo Admin", "admin", "NexTrade");

  const createRequest = (data) => {
    const record = new Record(requests);
    Object.keys(data).forEach((key) => record.set(key, data[key]));
    app.save(record);
    return record;
  };

  const mangoRequest = createRequest({
    title: "Fresh mango sourcing for Singapore",
    product_name: "Cat Chu mango",
    category: "fruit",
    quantity: "10 tons per month",
    target_country: "Singapore",
    budget_range: "USD 1.20 - 1.80 / kg",
    description: "Looking for export-ready fresh mango suppliers with GlobalG.A.P. preferred.",
    status: "sourcing",
    created_by: buyer.id,
  });
  const coffeeRequest = createRequest({
    title: "Robusta coffee beans for Germany",
    product_name: "Grade 1 Robusta coffee beans",
    category: "coffee",
    quantity: "1 x 20ft container",
    target_country: "Germany",
    budget_range: "USD 2,000 - 2,400 / ton",
    description: "Seeking washed Robusta beans with current crop information and samples.",
    status: "reviewing",
    created_by: buyer.id,
  });

  const createLead = (data) => {
    const record = new Record(leads);
    Object.keys(data).forEach((key) => record.set(key, data[key]));
    app.save(record);
  };

  createLead({ request: mangoRequest.id, supplier_name: "Mekong Fresh Export", contact_name: "Nguyen Lan", email: "sales@mekongfresh.example", country: "Vietnam", quoted_price: "USD 1.55 / kg", moq: "5 tons", notes: "Can provide packing and phytosanitary documents.", status: "shortlisted", created_by: admin.id });
  createLead({ request: mangoRequest.id, supplier_name: "Southern Orchard Co.", contact_name: "Tran Minh", phone: "+84 900 000 001", country: "Vietnam", quoted_price: "USD 1.48 / kg", moq: "10 tons", notes: "Seasonal capacity confirmed.", status: "contacted", created_by: admin.id });
  createLead({ request: coffeeRequest.id, supplier_name: "Highland Bean Trading", contact_name: "Le Hoa", email: "export@highlandbean.example", country: "Vietnam", quoted_price: "USD 2,250 / ton", moq: "1 container", notes: "Sample shipment available.", status: "verified", created_by: admin.id });
}, (app) => {
  // Seed migrations are intended for disposable local development data.
});
