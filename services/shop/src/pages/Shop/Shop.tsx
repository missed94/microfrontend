import { Link } from "react-router-dom";
import { shopRoutes } from "@packages/shared/src/routes/shop";

const Shop = () => {
  return (
    <h2>
      Shop
      <div>
        <Link to={shopRoutes.second}>go to second page</Link>
      </div>
    </h2>
  );
};

export default Shop;