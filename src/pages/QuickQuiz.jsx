import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import axios from "axios";
import { toast } from "react-toastify";

const quizQuestions = [
  {
    id: 1,
    question: "What’s your main goal for your car?",
    options: [
      { value: "detailing", label: "Keep it clean and shiny (Detailing)" },
      { value: "exterior", label: "Make it sporty (Body Kits & Lights)" },
      { value: "interior", label: "Add comfort & luxury (Interior Packages)" },
      { value: "performance", label: "Improve performance (Engine & Wheels)" },
    ],
  },
  {
    id: 2,
    question: "What type of car do you have?",
    options: [
      { value: "sedan", label: "Sedan" },
      { value: "suv", label: "SUV" },
      { value: "sports", label: "Sports Car" },
      { value: "hatchback", label: "Hatchback" },
    ],
  },
  {
    id: 3,
    question: "What’s your budget range?",
    options: [
      { value: "budget", label: "Under PKR 20,000" },
      { value: "moderate", label: "PKR 20,000 - 50,000" },
      { value: "premium", label: "PKR 50,000 - 100,000" },
      { value: "luxury", label: "Over PKR 100,000" },
    ],
  },
];

const QuickCarQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { cartItems, setCartItems } = useCart();

  const handleOptionSelect = async (optionValue) => {
    const updatedAnswers = {
      ...answers,
      [quizQuestions[currentQuestionIndex].id]: optionValue,
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Fetch recommendations from backend
      try {
        const payload = {
          goal: updatedAnswers[1],
          carType: updatedAnswers[2],
          budget: updatedAnswers[3],
        };

        const res = await axios.post("/api/quiz/car-recommendations", payload);
        setRecommendations(res.data.products || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      }

      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setRecommendations([]);
  };

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    toast.success(`${product.name} added to your cart!`);
  };

  return (
    <div className="bg-slate-950 min-h-screen py-8 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-red-600">
            Car Customization Quiz
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Answer a few quick questions to help us find the perfect car
            package for you.
          </p>
        </div>

        {!quizCompleted ? (
          <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-slate-800 h-2">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                  }%`,
                }}
              ></div>
            </div>

            <div className="p-6 sm:p-8 ">
              <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-6">
                {quizQuestions[currentQuestionIndex].question}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizQuestions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className="p-4 rounded-lg text-left hover:border-primary transition-colors btn"
                  >
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 text-sm text-gray-500 text-right">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-slate-800 rounded-lg shadow-md p-6 sm:p-8 mb-8">
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-red-600">
                  Here are your recommended car packages!
                </h2>
              </div>

              <p className="text-gray-300 mb-4">
                Based on your answers, we think these car packages match your
                preferences best.
              </p>

              <button
                onClick={handleRestartQuiz}
                className="text-primary hover:text-red-600 font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Restart Quiz
              </button>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((product) => (
                  <div
                    key={product._id}
                    className="bg-slate-800 text-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="h-64 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-red-600 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 mb-3">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-slate-300 mb-4">
                        PKR {product.price.toFixed(2)}
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn p-2"
                        >
                          Add to Cart
                        </button>
                        <Link
                          to={`/product/${product._id}`}
                          className="btn p-2"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-lg mt-8">
                No matching packages found. Please try different answers.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickCarQuiz;
