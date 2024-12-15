import { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ProductCard from "../components/ProductCard";

function ProductContainer() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/product/products")
      .then((response) => setProducts(response.data.data));
  }, []);
  console.log(products);

  return (
    <Container>
      <Row className="mt-5">
        {products.map((product) => (
          <Col className="crd-col" xs={12} sm={6} md={6} xl={3} key={product._id} >
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductContainer;
