
const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Fake Chat UI */}
        <div className="space-y-4">

          <div className="flex justify-start">
            <div className="bg-base-100 shadow-md rounded-2xl px-4 py-3 max-w-xs">
              Hey! How are you? 👋
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-primary text-primary-content rounded-2xl px-4 py-3 max-w-xs">
              I'm good! Building a chat app 😄
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-base-100 shadow-md rounded-2xl px-4 py-3 max-w-xs">
              That's awesome 🚀
            </div>
          </div>

        </div>

        {/* Text */}
        <div>
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-base-content/60 text-lg">{subtitle}</p>
        </div>

      </div>
    </div>
  );
};

export default AuthImagePattern;
