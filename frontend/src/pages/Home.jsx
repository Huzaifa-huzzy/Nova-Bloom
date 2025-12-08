import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import {
  ShoppingCartIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 12 }));
  }, [dispatch]);

  const categories = [
    { name: "Electronics", icon: "Laptop", color: "bg-blue-500" },
    { name: "Fashion", icon: "T-Shirt", color: "bg-pink-500" },
    { name: "Home & Living", icon: "Sofa", color: "bg-green-500" },
    { name: "Sports", icon: "Dumbbell", color: "bg-orange-500" },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "Best online shopping experience ever! Fast delivery and amazing quality.",
      rating: 5,
    },
    {
      name: "Ahmed K.",
      text: "I love the variety and the customer service is top-notch!",
      rating: 5,
    },
    {
      name: "Lisa Chen",
      text: "Found exactly what I needed at a great price. Will shop again!",
      rating: 5,
    },
  ];

  return (
    <>
      {/* ================= Hero Banner ================= */}
      <section className="relative rounded-2xl overflow-hidden mb-16 -mt-8">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1800&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-transparent to-gray-800/40" />

        <div className="relative py-32 px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-2xl leading-tight">
            Welcome to <br />
            <span className="text-white">
            Nova Bloom
            </span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-10 max-w-4xl mx-auto opacity-95 font-light">
            Discover premium products with unbeatable quality and lightning-fast
            delivery
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-gray-500/60 transform hover:scale-105 transition-all duration-300"
          >
            <ShoppingCartIcon className="w-7 h-7" />
            Shop Now
            <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-3 transition" />
          </Link>
        </div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      </section>
      {/* ================= Brands ================= */}
      <section className="py-16 bg-white rounded-3xl mb-20 overflow-hidden">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
          Trusted by Top Brands
        </h2>
        <div className="relative">
          <div className="flex animate-slide gap-12 items-center py-8 hover:[animation-play-state:paused]">
            {/* First set */}
            {[
              {
                name: "Nike",
                logo: "https://cdn.worldvectorlogo.com/logos/nike-11.svg",
              },
              {
                name: "Adidas",
                logo: "https://cdn.worldvectorlogo.com/logos/adidas-8.svg",
              },
              {
                name: "Apple",
                logo: "https://cdn.worldvectorlogo.com/logos/apple-11.svg",
              },
              {
                name: "Sony",
                logo: "https://cdn.worldvectorlogo.com/logos/sony-2.svg",
              },
              {
                name: "Samsung",
                logo: "https://cdn.worldvectorlogo.com/logos/samsung-8.svg",
              },
              {
                name: "LG",
                logo: "https://cdn.worldvectorlogo.com/logos/lg-1.svg",
              },
            ].map((brand) => (
              <div
                key={brand.name}
                className="flex-none bg-white rounded-2xl px-10 py-6 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
            {/* Duplicate set for infinite loop */}
            {[
              {
                name: "Nike",
                logo: "https://cdn.worldvectorlogo.com/logos/nike-11.svg",
              },
              {
                name: "Adidas",
                logo: "https://cdn.worldvectorlogo.com/logos/adidas-8.svg",
              },
              {
                name: "Apple",
                logo: "https://cdn.worldvectorlogo.com/logos/apple-11.svg",
              },
              {
                name: "Sony",
                logo: "https://cdn.worldvectorlogo.com/logos/sony-2.svg",
              },
              {
                name: "Samsung",
                logo: "https://cdn.worldvectorlogo.com/logos/samsung-8.svg",
              },
              {
                name: "LG",
                logo: "https://cdn.worldvectorlogo.com/logos/lg-1.svg",
              },
            ].map((brand) => (
              <div
                key={`${brand.name}-dup`}
                className="flex-none bg-white rounded-2xl px-10 py-6 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-slide {
            animation: slide 35s linear infinite;
          }
        `}</style>
      </section>

      {/* ================= Categories ================= */}
      <section className="mb-20 px-4">
  <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
    Shop by Category
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
    {[
      { name: "Dresses",     img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" },
      { name: "Tops",        img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80" },
      { name: "Shoes",       img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
      { name: "Bags",        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" },
      { name: "Jewelry",     img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80" },
      { name: "Activewear",  img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { name: "Outerwear",   img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { name: "Accessories", img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    ].map((cat) => (
      <Link
        key={cat.name}
        to="/products"
        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
      >
        {/* Image */}
        <img
          src={cat.img}
          alt={cat.name}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Dark overlay + text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            <h3 className="text-2xl font-bold text-white tracking-wide">
              {cat.name}
            </h3>
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>

      {/* ================= Flash Sale ================= */}
      <section className="mb-20 bg-gradient-to-r from-gray-900 to-black rounded-3xl p-10 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold flex items-center gap-4">
              <ClockIcon className="w-12 h-12 animate-pulse" />
              Flash Sale – Up to 70% OFF!
            </h2>
            <p className="text-xl mt-4">
              Limited time only – Ends in 24 hours!
            </p>
          </div>
          <Link
            to="/products"
            className="bg-white text-red-600 px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition"
          >
            Shop Deals Now
          </Link>
        </div>
      </section>

      {/* ================= Featured Products ================= */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">Handpicked just for you</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SALE
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <span className="absolute bottom-4 left-4 bg-white/90 text-black px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition">
                    View Details
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 line-through">
                        $99.99
                      </p>
                      <p className="text-3xl font-extrabold text-gray-900">
                        ${product.price}
                      </p>
                    </div>
                    <ArrowRightIcon className="w-7 h-7 text-gray-900 group-hover:translate-x-3 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ================= Best Sellers ================= */}
      <section className="mb-20 bg-gray-100 py-16 rounded-3xl">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Best Sellers This Week
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              name: "Wireless Earbuds Pro",
              price: 149.99,
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            },
            {
              name: "Smart Watch Ultra",
              price: 399.99,
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            },
            {
              name: "4K Action Camera",
              price: 279.99,
              rating: 4.7,
              img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            },
            {
              name: "Noise-Cancelling Headphones",
              price: 349.99,
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              name: "RGB Gaming Keyboard",
              price: 129.99,
              rating: 4.6,
              img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
            },
            {
              name: "Portable SSD 2TB",
              price: 189.99,
              rating: 4.8,
              img: "https://images.unsplash.com/photo-1577538926210-fc6cc624fde2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              name: "Ergonomic Office Chair",
              price: 499.99,
              rating: 4.9,
              img: "https://images.unsplash.com/photo-1688578735352-9a6f2ac3b70a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              name: "LED Desk Lamp",
              price: 79.99,
              rating: 4.7,
              img: "https://plus.unsplash.com/premium_photo-1672166939591-b2547bd18fca?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          ].map((item, i) => (
            <Link
              key={i}
              to="/products"
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500"
            >
              <div className="relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST SELLER
                </div>
              </div>
              <div className="p-5 text-center">
                <h4 className="font-bold text-gray-800 line-clamp-2 mb-2">
                  {item.name}
                </h4>
                <div className="flex justify-center items-center gap-1 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <StarIcon
                      key={idx}
                      className={`w-5 h-5 ${
                        idx < Math.floor(item.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({item.rating})
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">
                  ${item.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= Why Choose Us ================= */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Why Choose MERN Shop?
          </h2>
          <p className="text-xl text-gray-600">
            We deliver excellence in every order
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: TruckIcon,
              title: "Lightning Fast Shipping",
              desc: "Same-day dispatch & tracked delivery worldwide",
            },
            {
              icon: ShieldCheckIcon,
              title: "100% Secure Payments",
              desc: "Encrypted transactions with buyer protection",
            },
            {
              icon: StarIcon,
              title: "Premium Quality",
              desc: "Curated products from trusted global brands",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl hover:shadow-2xl transition text-center"
            >
              <item.icon className="w-16 h-16 text-gray-900 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Testimonials ================= */}
      <section className="mb-20">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
            >
              <div className="flex mb-4">
                {[...Array(t.rating)].map((_, idx) => (
                  <StarIcon
                    key={idx}
                    className="w-6 h-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full"></div>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Instagram Gallery ================= */}
      <section className="mb-20">
        <h2 className="text-4xl font-extrabold text-center mb-12 flex items-center justify-center gap-4">
          <CameraIcon className="w-12 h-12 text-gray-900" />
          Shop Our Instagram
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1452251889946-8ff5ea7b27ab?q=80&w=799&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
            "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800",
            "https://plus.unsplash.com/premium_photo-1693222144259-c02fc9fd8de9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=800",
            "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800",
            "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1589&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ].map((src, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 border-2 border-dashed rounded-xl overflow-hidden hover:scale-105 transition"
            >
              <img
                src={src}
                alt="Instagram"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
