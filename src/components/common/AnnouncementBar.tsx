import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getHomepageSections } from "@/lib/services/firebase/homepageService";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    getHomepageSections().then((sections) => {
      const barSection = sections.find((s) => s.id === "announcement_bar" && s.active);
      if (barSection && barSection.content?.["textAr"]) {
        setText(barSection.content["textAr"] as string);
      } else if (!barSection || !barSection.active) {
        setVisible(false);
      }
    });
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-[#FFC700] text-black py-2.5 px-4 text-xs md:text-sm font-bold tracking-wide dir-rtl shadow-xs transition-all relative">
      <div className="container-page flex items-center justify-center relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute right-0 p-1 hover:bg-black/10 rounded-full transition-colors"
          aria-label="إغلاق الإعلان"
        >
          <X className="h-4 w-4 text-black" />
        </button>
        <span className="text-center font-black">{text}</span>
      </div>
    </div>
  );
}
