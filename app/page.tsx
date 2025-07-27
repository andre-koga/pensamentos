import WeatherTime from '@/components/weather-time';

const asciiArt: string = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░░░░░░░
▒   ▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒   ▒▒▒▒   ▒▒▒▒   ▒▒▒▒▒   ▒   ▒▒▒▒     ▒▒▒▒▒   ▒▒▒▒▒    ▒   ▒   ▒▒▒▒▒   ▒▒▒▒▒   ▒   ▒▒▒    ▒  ▒▒▒▒   ▒▒▒▒▒▒     ▒
▓        ▓▓▓▓  ▓▓▓   ▓▓▓   ▓▓   ▓   ▓▓▓▓▓▓   ▓▓   ▓▓▓   ▓▓  ▓▓   ▓▓  ▓▓▓   ▓▓▓   ▓▓   ▓▓▓   ▓▓▓▓   ▓▓   ▓▓   ▓▓▓▓
▓   ▓▓▓▓▓▓▓▓         ▓▓▓   ▓▓   ▓▓▓    ▓▓   ▓▓▓   ▓▓▓   ▓▓  ▓▓   ▓         ▓▓▓   ▓▓   ▓▓▓   ▓▓▓   ▓▓▓▓   ▓▓▓    ▓
▓   ▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓   ▓▓   ▓▓▓▓▓   ▓   ▓▓▓   ▓▓▓   ▓▓  ▓▓   ▓  ▓▓▓▓▓▓▓▓▓▓   ▓▓   ▓▓▓   ▓ ▓▓   ▓▓   ▓▓▓▓▓▓   
█   ██████████     ████    ██   █      ████   █    █    ██  ██   ███     ████    ██   ████   █████   █████      █
█████████████████████████████████████████████████████████████████████████████████████████████████████████████████`;

export default function Home() {
  return (
    <>
      <div className="mx-auto">
        <pre className="flex flex-col gap-4 text-center font-mono leading-none">
          {asciiArt}
          <p className="text-center italic">
            - aka &quot;Thoughts&quot; in Portuguese -
          </p>
        </pre>
      </div>
      <div className="border-border mx-auto border p-4 px-20"></div>
      <div className="border-border mx-auto border p-4 px-12"></div>
      <div className="border-border mx-auto border p-4"></div>
      <div className="border-border mx-auto border p-4">
        <p className="text-center font-mono">Sao Paulo, Brazil</p>
      </div>

      {/* Weather and Time Component */}
      <div className="mt-8 flex justify-center">
        <WeatherTime />
      </div>
    </>
  );
}
