const getProductsQuery = `
  SELECT
    p.*,
    c.category_name
  FROM Products p
  JOIN Categories c ON p.category_id = c.category_id
`;

const getProductByIdQuery = `
  SELECT
    p.*,
    c.category_name
  FROM Products p
  JOIN Categories c ON p.category_id = c.category_id
  WHERE p.product_id = $1
`;

const getCategoriesQuery = `
  SELECT * FROM Categories
`;

const sqlCheckName = `SELECT * FROM customers WHERE email = ?`;

module.exports = {
    getProductsQuery,
    getProductByIdQuery,
    getCategoriesQuery,
    sqlCheckName
};
