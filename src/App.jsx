import { useState, useMemo } from "react";

const DUMMY_EVENTS = [
  { id: 1, date: "2026-04-03", title: "ゲートボール大会", category: "sports", time: "09:00〜12:00", location: "日進市香久山公園", description: "春の親善ゲートボール大会。初心者歓迎！" },
  { id: 2, date: "2026-04-07", title: "健康体操教室", category: "recreation", time: "10:00〜11:30", location: "日進市中央福祉センター", description: "椅子に座ったままできる軽い体操。毎週月曜開催。" },
  { id: 3, date: "2026-04-10", title: "囲碁・将棋サロン", category: "other", time: "13:00〜16:00", location: "名古屋市千種区文化センター", description: "棋力問わず歓迎。お茶を飲みながら対局を楽しもう。" },
  { id: 4, date: "2026-04-12", title: "シニアヨガ体験", category: "sports", time: "10:30〜12:00", location: "日進市スポーツセンター", description: "ゆっくりしたペースで行うやさしいヨガ。初回無料。" },
  { id: 5, date: "2026-04-14", title: "春の写真撮影会", category: "recreation", time: "09:00〜12:00", location: "東山動植物園（名古屋市）", description: "桜と新緑をカメラに収めよう。スマホ参加もOK。" },
  { id: 6, date: "2026-04-16", title: "介護予防講座", category: "lecture", time: "14:00〜16:00", location: "日進市保健センター", description: "転倒予防・認知症予防の最新情報をわかりやすく解説。" },
  { id: 7, date: "2026-04-19", title: "コーラス同好会", category: "recreation", time: "13:00〜15:00", location: "日進市中央文化センター", description: "懐かしの歌謡曲を皆で歌いましょう。見学自由。" },
  { id: 8, date: "2026-04-21", title: "スマホ活用講座", category: "lecture", time: "10:00〜12:00", location: "日進市図書館", description: "LINE・写真・地図アプリの使い方をやさしく説明。" },
  { id: 9, date: "2026-04-23", title: "グラウンドゴルフ大会", category: "sports", time: "09:00〜13:00", location: "名古屋市天白区植田公園", description: "気軽に参加できるグラウンドゴルフ大会。用具貸出あり。" },
  { id: 10, date: "2026-04-25", title: "陶芸体験ワークショップ", category: "recreation", time: "10:00〜12:00", location: "愛知陶芸センター（長久手市）", description: "本格的な轆轤体験。作品は後日お渡し。" },
  { id: 11, date: "2026-04-26", title: "健康麻雀教室", category: "other", time: "13:00〜16:00", location: "日進市福祉センター", description: "賭けなし・タバコなし・お酒なしの健康麻雀。脳トレに最適。" },
  { id: 12, date: "2026-04-28", title: "栄養・食生活セミナー", category: "lecture", time: "14:00〜15:30", location: "名古屋市昭和区保健センター", description: "シニアのための食事バランスと骨粗鬆症予防。管理栄養士が講義。" },
  { id: 13, date: "2026-05-02", title: "ノルディックウォーキング", category: "sports", time: "08:30〜10:30", location: "日進市梅森公園", description: "ポールを使った有酸素運動。貸出ポールあり。雨天中止。" },
  { id: 14, date: "2026-05-07", title: "押し花アート教室", category: "recreation", time: "10:00〜12:00", location: "日進市中央文化センター", description: "季節の花を使った押し花作品づくり。材料費500円。" },
  { id: 15, date: "2026-05-10", title: "シニア向け水泳教室", category: "sports", time: "10:00〜11:30", location: "日進市総合体育館プール", description: "泳げなくてもOK。水中ウォーキングから始めます。" },
];

const CATEGORIES = [
  { key: "all", label: "すべて", color: "#6b7280", bg: "#f3f4f6" },
  { key: "sports", label: "スポーツ", color: "#1d6fb5", bg: "#e6f1fb" },
  { key: "recreation", label: "レク", color: "#0f6e56", bg: "#e1f5ee" },
  { key: "lecture", label: "講座", color: "#854f0b", bg: "#faeeda" },
  { key: "other", label: "その他", color: "#6b3b8f", bg: "#eeedfe" },
];

const REGIONS = {
  "北海道": ["札幌市", "旭川市", "函館市", "釧路市", "帯広市", "小樽市", "苫小牧市"],
  "青森県": ["青森市", "弘前市", "八戸市", "十和田市", "むつ市"],
  "岩手県": ["盛岡市", "花巻市", "一関市", "奥州市", "北上市", "宮古市"],
  "宮城県": ["仙台市", "石巻市", "大崎市", "気仙沼市", "名取市"],
  "秋田県": ["秋田市", "横手市", "大仙市", "能代市", "湯沢市"],
  "山形県": ["山形市", "鶴岡市", "酒田市", "米沢市", "天童市"],
  "福島県": ["福島市", "郡山市", "いわき市", "会津若松市", "白河市"],
  "茨城県": ["水戸市", "つくば市", "日立市", "土浦市", "古河市", "ひたちなか市"],
  "栃木県": ["宇都宮市", "小山市", "栃木市", "足利市", "那須塩原市"],
  "群馬県": ["前橋市", "高崎市", "桐生市", "太田市", "沼田市"],
  "埼玉県": ["さいたま市", "川口市", "川越市", "所沢市", "越谷市", "熊谷市"],
  "千葉県": ["千葉市", "船橋市", "松戸市", "柏市", "市川市", "市原市"],
  "東京都": ["新宿区", "渋谷区", "世田谷区", "豊島区", "江東区", "八王子市", "町田市"],
  "神奈川県": ["横浜市", "川崎市", "相模原市", "藤沢市", "横須賀市", "平塚市"],
  "新潟県": ["新潟市", "長岡市", "上越市", "三条市", "柏崎市"],
  "富山県": ["富山市", "高岡市", "魚津市", "氷見市", "射水市"],
  "石川県": ["金沢市", "白山市", "小松市", "加賀市", "七尾市"],
  "福井県": ["福井市", "敦賀市", "小浜市", "越前市", "坂井市"],
  "山梨県": ["甲府市", "富士吉田市", "山梨市", "大月市", "韮崎市"],
  "長野県": ["長野市", "松本市", "上田市", "佐久市", "飯田市", "諏訪市"],
  "岐阜県": ["岐阜市", "大垣市", "多治見市", "関市", "高山市", "各務原市"],
  "静岡県": ["静岡市", "浜松市", "沼津市", "富士市", "磐田市", "焼津市"],
  "愛知県": ["名古屋市", "豊橋市", "岡崎市", "一宮市", "豊田市", "日進市", "長久手市"],
  "三重県": ["津市", "四日市市", "松阪市", "伊勢市", "鈴鹿市", "桑名市"],
  "滋賀県": ["大津市", "草津市", "彦根市", "長浜市", "近江八幡市"],
  "京都府": ["京都市", "宇治市", "亀岡市", "舞鶴市", "長岡京市"],
  "大阪府": ["大阪市", "堺市", "豊中市", "吹田市", "高槻市", "枚方市", "東大阪市"],
  "兵庫県": ["神戸市", "姫路市", "西宮市", "尼崎市", "明石市", "宝塚市"],
  "奈良県": ["奈良市", "大和高田市", "橿原市", "桜井市", "生駒市"],
  "和歌山県": ["和歌山市", "田辺市", "新宮市", "海南市", "橋本市"],
  "鳥取県": ["鳥取市", "米子市", "倉吉市", "境港市"],
  "島根県": ["松江市", "出雲市", "浜田市", "益田市", "大田市"],
  "岡山県": ["岡山市", "倉敷市", "津山市", "総社市", "玉野市"],
  "広島県": ["広島市", "福山市", "尾道市", "三次市", "東広島市", "呉市"],
  "山口県": ["山口市", "下関市", "宇部市", "防府市", "岩国市"],
  "徳島県": ["徳島市", "鳴門市", "阿南市", "吉野川市", "小松島市"],
  "香川県": ["高松市", "丸亀市", "坂出市", "善通寺市", "観音寺市"],
  "愛媛県": ["松山市", "今治市", "宇和島市", "新居浜市", "西条市"],
  "高知県": ["高知市", "四万十市", "南国市", "土佐市", "安芸市"],
  "福岡県": ["福岡市", "北九州市", "久留米市", "飯塚市", "春日市", "大牟田市"],
  "佐賀県": ["佐賀市", "唐津市", "鳥栖市", "伊万里市", "武雄市"],
  "長崎県": ["長崎市", "佐世保市", "諫早市", "大村市", "島原市"],
  "熊本県": ["熊本市", "八代市", "荒尾市", "天草市", "菊池市"],
  "大分県": ["大分市", "別府市", "中津市", "日田市", "佐伯市"],
  "宮崎県": ["宮崎市", "都城市", "延岡市", "日南市", "小林市"],
  "鹿児島県": ["鹿児島市", "霧島市", "薩摩川内市", "鹿屋市", "出水市"],
  "沖縄県": ["那覇市", "沖縄市", "浦添市", "宜野湾市", "名護市", "うるま市"],
};

const CAT_DOT = { sports: "#378add", recreation: "#1d9e75", lecture: "#ba7517", other: "#7f77dd" };

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year, month) { return new Date(year, month, 1).getDay(); }

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [prefecture, setPrefecture] = useState("愛知県");
  const [city, setCity] = useState("名古屋市");
  const [showModal, setShowModal] = useState(false);

  const pad = (n) => String(n).padStart(2, "0");

  const eventsByDate = useMemo(() => {
    const map = {};
    DUMMY_EVENTS.forEach((e) => { if (!map[e.date]) map[e.date] = []; map[e.date].push(e); });
    return map;
  }, []);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    const all = eventsByDate[selectedDate] || [];
    return filterCat === "all" ? all : all.filter((e) => e.category === filterCat);
  }, [selectedDate, filterCat, eventsByDate]);

  const monthEvents = useMemo(() => {
    const prefix = `${year}-${pad(month + 1)}`;
    return DUMMY_EVENTS.filter((e) => e.date.startsWith(prefix) && (filterCat === "all" || e.category === filterCat));
  }, [year, month, filterCat]);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); setSelectedDate(null); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); setSelectedDate(null); };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const weeks = [];
  let day = 1 - firstDay;
  while (day <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++, day++) { week.push(day >= 1 && day <= daysInMonth ? day : null); }
    weeks.push(week);
  }

  const monthLabel = `${year}年${month + 1}月`;
  const catInfo = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[0];

  return (
    <div style={{ fontFamily: "'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif", maxWidth: 480, margin: "0 auto", padding: "0 0 80px", fontSize: 17 }}>
      <div style={{ background: "#1a5fa8", padding: "18px 20px 14px", color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>シニア向け地域イベント</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>イベントカレンダー</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <select value={prefecture} onChange={e => { setPrefecture(e.target.value); setCity(REGIONS[e.target.value][0]); }} style={{ flex: 1, fontSize: 16, padding: "8px 10px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff" }}>
            {Object.keys(REGIONS).map(p => <option key={p} value={p} style={{ color: "#000" }}>{p}</option>)}
          </select>
          <select value={city} onChange={e => setCity(e.target.value)} style={{ flex: 1, fontSize: 16, padding: "8px 10px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff" }}>
            {(REGIONS[prefecture] || []).map(c => <option key={c} value={c} style={{ color: "#000" }}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, padding: "12px 12px 0", overflowX: "auto" }}>
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setFilterCat(cat.key)} style={{ flexShrink: 0, fontSize: 14, fontWeight: filterCat === cat.key ? 700 : 400, padding: "7px 14px", borderRadius: 20, border: `2px solid ${filterCat === cat.key ? cat.color : "#e5e7eb"}`, background: filterCat === cat.key ? cat.bg : "#fff", color: filterCat === cat.key ? cat.color : "#6b7280", cursor: "pointer" }}>{cat.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 8px" }}>
        <button onClick={prevMonth} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", color: "#1a5fa8", padding: "4px 12px" }}>‹</button>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#1a2a3a" }}>{monthLabel}</span>
        <button onClick={nextMonth} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", color: "#1a5fa8", padding: "4px 12px" }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", padding: "0 8px" }}>
        {["日","月","火","水","木","金","土"].map((d, i) => (
          <div key={d} style={{ fontSize: 13, fontWeight: 600, padding: "4px 0", color: i === 0 ? "#c0392b" : i === 6 ? "#1a5fa8" : "#6b7280" }}>{d}</div>
        ))}
      </div>

      <div style={{ padding: "4px 8px 0" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {week.map((d, di) => {
              if (!d) return <div key={di} />;
              const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
              const dayEvents = (eventsByDate[dateStr] || []).filter(e => filterCat === "all" || e.category === filterCat);
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = dateStr === selectedDate;
              return (
                <button key={di} onClick={() => { setSelectedDate(dateStr); if (dayEvents.length > 0) setShowModal(true); }} style={{ minHeight: 52, borderRadius: 8, border: isSelected ? "2px solid #1a5fa8" : "1px solid #e5e7eb", background: isSelected ? "#e6f1fb" : isToday ? "#fff8e6" : "#fff", cursor: "pointer", padding: "4px 2px 6px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: 16, background: isToday ? "#f59e0b" : "none", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: isToday ? "#fff" : di === 0 ? "#c0392b" : di === 6 ? "#1a5fa8" : "#1a2a3a" }}>{d}</span>
                  <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", marginTop: 2 }}>
                    {dayEvents.slice(0, 3).map((e, ei) => (
                      <span key={ei} style={{ width: 7, height: 7, borderRadius: "50%", background: CAT_DOT[e.category] || "#888", display: "block" }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 14px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a2a3a", marginBottom: 10 }}>{monthLabel}のイベント一覧（{monthEvents.length}件）</div>
        {monthEvents.length === 0 ? (
          <div style={{ color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>イベントがありません</div>
        ) : monthEvents.map(e => {
          const cat = catInfo(e.category);
          return (
            <div key={e.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "12px 14px", marginBottom: 10, borderLeft: `4px solid ${cat.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, background: cat.bg, color: cat.color, borderRadius: 4, padding: "2px 8px" }}>{cat.label}</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{e.date.replace(/\d{4}-(\d{2})-(\d{2})/, "$1月$2日")}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a2a3a", marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>🕐 {e.time}　📍 {e.location}</div>
              <div style={{ fontSize: 14, color: "#4b5563", marginTop: 4 }}>{e.description}</div>
            </div>
          );
        })}
      </div>

      {showModal && selectedDate && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 480, margin: "0 auto", padding: "20px 16px 36px", maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a2a3a" }}>{selectedDate.replace(/\d{4}-(\d{2})-(\d{2})/, "$1月$2日")}のイベント</div>
              <button onClick={() => setShowModal(false)} style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>
            {selectedEvents.length === 0 ? (
              <div style={{ color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>この日のイベントはありません</div>
            ) : selectedEvents.map(e => {
              const cat = catInfo(e.category);
              return (
                <div key={e.id} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", marginBottom: 10, borderLeft: `4px solid ${cat.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, background: cat.bg, color: cat.color, borderRadius: 4, padding: "2px 8px" }}>{cat.label}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a2a3a", marginBottom: 6 }}>{e.title}</div>
                  <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 2 }}>🕐 {e.time}</div>
                  <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 6 }}>📍 {e.location}</div>
                  <div style={{ fontSize: 15, color: "#4b5563" }}>{e.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
