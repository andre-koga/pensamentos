import WeatherTime from '@/components/weather-time';

export default function Home() {
  return (
    <>
      <div className="mx-auto my-auto flex flex-col gap-4 text-center">
        <p className="text-muted-foreground leading-8">
          <span className="font-bold">sonder.</span>
          <br />
          the feeling one has
          <br />
          on realizing that every other individual one sees has a life as full
          and real as one&apos;s own,
          <br />
          in which they are the central character and others,
          <br />
          including oneself,
          <br />
          have secondary or insignificant roles.
        </p>
      </div>
      {/* Weather and Time Component */}
      <div className="flex justify-center gap-4">
        <WeatherTime />
      </div>
    </>
  );
}
