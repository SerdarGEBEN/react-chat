import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useRef, useState } from "react";
import Message from "../components/Message";
import EmojiPicker from "emoji-picker-react";

const ChatPage = ({ room, setRoom }) => {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const lastMsg = useRef(null);

  // form gönderilince mesajı veritabanına kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();

    // mesaj boşmu kontrol et boşsa durdur
    if (text.trim() === "") return;

    // mesaj documentinin kaydedileceği koleksiyonun referansını al
    const messagesCol = collection(db, "messages");

    // referansı alınan koleksiyonu documentı ekle
    await addDoc(messagesCol, {
      text,
      room,
      author: {
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        photo: auth.currentUser.photoURL,
      },
      createdAt: serverTimestamp(),
    });

    // formu temizle

    setText("");
  };

  // mevcut odada gönderilen meajları anlık olarak al
  useEffect(() => {
    // 1) abone ulunacak koleksiyonun referansını al
    const messagesCol = collection(db, "messages");

    // 2) sorgu ayarlarıyap
    const q = query(
      messagesCol,
      where("room", "==", room),
      orderBy("createdAt", "asc")
    );

    // 3) onSnapshot: anlık olarak kolleksiyondaki değişimleri izler. her değişitiğinde callback fn tetiklenir ve güncellemleri alır
    const unsub = onSnapshot(q, (snapshot) => {
      let temp = [];

      // data () methodu ile dökümanların içerisindeki veriye erişip geçici diziye aktardık
      snapshot.docs.forEach((doc) => {
        temp.push(doc.data());
      });

      // son mesaja odakla

      lastMsg.current.scrollIntoView({ behavior: "smooth" });

      setMessages(temp);
    });

    // 4) kullanıcı sayfadan ayrıldığı an yüklemeyi durdur
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="chat-page">
      <header>
        <p>{auth.currentUser?.displayName}</p>
        <p>{room}</p>
        <button onClick={() => setRoom(null)}>Farklı Oda</button>
      </header>

      <main>
        {messages.length < 1 ? (
          <div className="warn">
            <p>Sohbete İlk Mesajı Gönderin</p>
          </div>
        ) : (
          messages.map((data, key) => <Message data={data} key={key} />)
        )}
        <div ref={lastMsg} />
      </main>

      <form className="send-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="mejazınızı yazınız"
          type="text"
        />
        <div>
          <EmojiPicker
            onEmojiClick={(e) => {
              setText(text + e.emoji);
              setIsOpen(false);
            }}
            open={isOpen}
            skinTonesDisabled
          />
          <button type="button" onClick={() => setIsOpen(!isOpen)}>
            😉
          </button>
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default ChatPage;
