const fs = require("fs");
const url = require("url");
const path = require("path");
const replaceTemplate = require("./modules/replaceTemplate");

// Reading HTML files with absolute paths
const tempOverview = fs.readFileSync(
  path.join(__dirname, "templates/template-overview.html"),
  "utf-8"
);
const tempCard = fs.readFileSync(
  path.join(__dirname, "templates/template-card.html"),
  "utf-8"
);
const tempProduct = fs.readFileSync(
  path.join(__dirname, "templates/template-product.html"),
  "utf-8"
);

// Reading CSS files with absolute paths
const tempProductStyle = fs.readFileSync(
  path.join(__dirname, "templates/public/template-product.css"),
  "utf-8"
);
const tempOverviewStyle = fs.readFileSync(
  path.join(__dirname, "templates/public/template-overview.css"),
  "utf-8"
);

// Reading JSON file with absolute path
const data = fs.readFileSync(
  path.join(__dirname, "dev-data/data.json"),
  "utf-8"
);
const dataObj = JSON.parse(data);

// Export the handler function for Vercel
module.exports = (req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Serve CSS files
  if (pathname === "/public/template-overview.css") {
    res.writeHead(200, { "Content-type": "text/css" });
    res.end(tempOverviewStyle);
  } else if (pathname === "/public/template-product.css") {
    res.writeHead(200, { "Content-type": "text/css" });
    res.end(tempProductStyle);

    // Overview page
  } else if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    if (product) {
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    } else {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("<h1>Product not found!</h1>");
    }
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
};