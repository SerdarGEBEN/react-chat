import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/index";

const LoginPage = ({ setIsAuth }) => {
  // butona tıklanınca çalışır
  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        //state'i güncelle
        setIsAuth(data.user.refreshToken);
        // local storage'i da güncelle
        localStorage.setItem("token", data.user.refreshToken);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <div className="login">
        <h1>Chat Odası</h1>

        <p>Devam Etmek İçin Giriş Yapınız</p>

        <button onClick={handleClick}>
          <img src="google.webp" alt="google" />
          <span>Google ile Giriş Yap</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
