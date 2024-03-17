function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
      <h1 className="text-red-600 text-9xl font-bold mb-4">404</h1>
      <a href="/home">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
          id="backToHomeButton"
        >
          backToHome
        </button>
      </a>
    </div>
  );
}

export default NotFound;
