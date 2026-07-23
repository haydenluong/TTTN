export default function Footer({ copyrightText }) {
  return (
    <footer className="w-full pb-3 bg-[#0D5939] border-t border-[#0D5939]">
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">{copyrightText}</p>
      </div>
    </footer>
  );
}
