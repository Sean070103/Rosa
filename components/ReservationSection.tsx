'use client'

import { useState } from 'react'
import { Calendar, Users, MapPin, Sparkles, Check, Sun, Copy, Phone } from 'lucide-react'

export function ReservationSection() {
  const [branch, setBranch] = useState<'lake' | 'niugan'>('lake')
  const [guests, setGuests] = useState(2)
  const [seatingArea, setSeatingArea] = useState('Waterfront Bay Veranda')
  const [selectedDate, setSelectedDate] = useState('Today (Sunset Session)')
  const [selectedTime, setSelectedTime] = useState('5:15 PM · Golden Hour Peak')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isBooked, setIsBooked] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [copied, setCopied] = useState(false)

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    const prefix = branch === 'niugan' ? 'RES-NGN' : 'RES-LKE'
    const ref = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
    setBookingRef(ref)
    setIsBooked(true)
  }

  const copyBooking = () => {
    const branchName = branch === 'niugan' ? 'ROSA DOSE NIUGAN (Downtown Cabuyao)' : 'ROSA DOSE LAKE (Queen Aurora Resort)'
    const text = `🌅 ROSA DOSE RESERVATION #${bookingRef}
BRANCH: ${branchName}
NAME: ${name} (${phone})
GUESTS: ${guests}
AREA: ${seatingArea}
TIME: ${selectedDate} at ${selectedTime}
📍 ${branch === 'niugan' ? 'Niugan Old National Highway, Cabuyao' : 'Queen Aurora Garden Resort, Cabuyao, Laguna'}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="reserve" className="border-b-4 border-black bg-[#FF8A00] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Why Reserve */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
              ★ SECTION 04 // TABLE BOOKING ★
            </div>

            <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl leading-tight">
              RESERVE YOUR GOLDEN HOUR.
            </h2>

            <p className="font-mono text-xs leading-relaxed text-black/90">
              Laguna de Bay sunset peaks between 4:45 PM and 6:15 PM. Front-row veranda tables overlook the calm water as skies turn pastel.
            </p>

            <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] space-y-2 font-mono text-xs">
              <p className="font-arcade text-[9px] text-[#FF5722]">[★ COMPLIMENTARY RESERVATION PERKS]</p>
              <ul className="space-y-1 text-black/80">
                <li>✦ Reserved panoramic bay view table (held for 20m)</li>
                <li>✦ Free resort gate entry & secured parking</li>
                <li>✦ Welcome taster of seasonal cold brew</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 font-arcade text-[10px] text-black">
              <span>CALL DIRECT:</span>
              <a href="tel:09279532665" className="bg-black text-[#FFE600] px-2 py-1 underline">
                0927 953 2665
              </a>
            </div>
          </div>

          {/* Right Column: Neo Booking Window */}
          <div className="lg:col-span-7">
            <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#000]">
              {isBooked ? (
                /* Confirmed State */
                <div className="text-center space-y-5 py-4 animate-in zoom-in-95 duration-150">
                  <div className="border-4 border-black bg-[#A3E635] p-3 shadow-[4px_4px_0_0_#000]">
                    <span className="font-arcade text-[9px] text-black">★ TABLE RESERVATION CONFIRMED ★</span>
                    <h3 className="font-pixel text-3xl font-bold mt-1 text-black">
                      SEE YOU SOON, {name.toUpperCase()}!
                    </h3>
                  </div>

                  <div className="border-3 border-black bg-[#FFFDF0] p-4 text-left font-mono text-xs space-y-1.5 shadow-[3px_3px_0_0_#000]">
                    <p><strong>CODE:</strong> <span className="font-arcade text-[#FF5722]">{bookingRef}</span></p>
                    <p><strong>PARTY:</strong> {guests} Guests</p>
                    <p><strong>ZONE:</strong> {seatingArea}</p>
                    <p><strong>TIME:</strong> {selectedDate} @ {selectedTime}</p>
                    <p><strong>LOCATION:</strong> Rora Dose @ Queen Aurora Garden Resort</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 font-arcade text-xs">
                    <button
                      onClick={copyBooking}
                      className="neo-btn flex-1 flex items-center justify-center gap-2 bg-[#FFE600] py-3 text-black"
                    >
                      {copied ? <Check className="size-4 stroke-[3]" /> : <Copy className="size-4" />}
                      <span>{copied ? '[COPIED!]' : '[COPY SLIP]'}</span>
                    </button>
                    <button
                      onClick={() => setIsBooked(false)}
                      className="neo-btn bg-black text-white px-5 py-3"
                    >
                      [NEW BOOKING]
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Form */
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="border-b-3 border-black pb-3">
                    <h3 className="font-pixel text-2xl font-bold text-black">
                      CLAIM YOUR TABLE
                    </h3>
                    <p className="font-mono text-xs text-black/70">
                      No reservation deposit required.
                    </p>
                  </div>

                  {/* Branch selector */}
                  <div>
                    <label className="font-arcade text-[9px] text-black block mb-1.5">
                      [SELECT BRANCH]
                    </label>
                    <div className="grid grid-cols-2 gap-2 font-silk text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setBranch('lake')
                          setSeatingArea('Waterfront Bay Veranda')
                        }}
                        className={`neo-btn p-2.5 text-left ${
                          branch === 'lake' ? 'bg-[#FFE600] text-black font-bold' : 'bg-[#FFFDF0] text-black'
                        }`}
                      >
                        <p className="font-bold">🌊 LAKE BRANCH</p>
                        <p className="text-[9px] text-black/70">Queen Aurora Resort</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setBranch('niugan')
                          setSeatingArea('Study Stalls & Co-Work (AC)')
                        }}
                        className={`neo-btn p-2.5 text-left ${
                          branch === 'niugan' ? 'bg-[#A3E635] text-black font-bold' : 'bg-[#FFFDF0] text-black'
                        }`}
                      >
                        <p className="font-bold">🌿 NIUGAN BRANCH</p>
                        <p className="text-[9px] text-black/70">Downtown Cabuyao</p>
                      </button>
                    </div>
                  </div>

                  {/* Guests selector */}
                  <div>
                    <label className="font-arcade text-[9px] text-black block mb-1.5">
                      [NUMBER OF GUESTS]
                    </label>
                    <div className="flex flex-wrap gap-1.5 font-arcade text-xs">
                      {[1, 2, 3, 4, 5, 6, '7+'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(typeof num === 'number' ? num : 8)}
                          className={`size-10 border-2 border-black flex items-center justify-center font-bold ${
                            (typeof num === 'number' && guests === num) || (num === '7+' && guests >= 7)
                              ? 'bg-[#FFE600] text-black shadow-[2px_2px_0_0_#000]'
                              : 'bg-[#FFFDF0] text-black hover:bg-neutral-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Area selection */}
                  <div>
                    <label className="font-arcade text-[9px] text-black block mb-1.5">
                      [SEATING ZONE - {branch === 'niugan' ? 'NIUGAN' : 'LAKEFRONT'}]
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-silk text-xs">
                      {(branch === 'lake'
                        ? ['Waterfront Bay Veranda', 'Indoor Slow Bar AC', 'Garden Courtyard']
                        : ['Study Stalls & Co-Work (AC)', 'Main Espresso Hall', 'Alfresco Patio']
                      ).map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setSeatingArea(area)}
                          className={`neo-btn p-2 text-left text-[11px] ${
                            seatingArea === area
                              ? 'bg-[#00F0FF] text-black font-bold'
                              : 'bg-[#FFFDF0] text-black'
                          }`}
                        >
                          {area.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div>
                      <label className="font-arcade text-[8px] text-black block mb-1">
                        [DATE]
                      </label>
                      <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border-2 border-black bg-[#FFFDF0] px-3 py-2 text-xs text-black focus:outline-none"
                      >
                        <option value="Today (Sunset Session)">Today (Sunset Session)</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="This Friday">This Friday</option>
                        <option value="This Saturday">This Saturday</option>
                        <option value="This Sunday">This Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-arcade text-[8px] text-black block mb-1">
                        [TIME SLOT]
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full border-2 border-black bg-[#FFFDF0] px-3 py-2 text-xs text-black focus:outline-none"
                      >
                        <option value="4:30 PM · Early Sunset Glow">4:30 PM · Early Sunset Glow</option>
                        <option value="5:15 PM · Golden Hour Peak">5:15 PM · Golden Hour Peak</option>
                        <option value="6:30 PM · Twilight Lake Breeze">6:30 PM · Twilight Lake Breeze</option>
                        <option value="8:00 PM · Post-Dinner Pour-Over">8:00 PM · Post-Dinner Pour-Over</option>
                        <option value="10:00 PM · Late Night Kwentuhan">10:00 PM · Late Night Kwentuhan</option>
                      </select>
                    </div>
                  </div>

                  {/* Guest Info inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
                    <input
                      type="text"
                      required
                      placeholder="YOUR FULL NAME *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-black bg-[#FFFDF0] px-3 py-2.5 text-black placeholder:text-black/50 focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="CONTACT NUMBER (VIBER) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 border-black bg-[#FFFDF0] px-3 py-2.5 text-black placeholder:text-black/50 focus:outline-none"
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="neo-btn w-full bg-[#FFE600] py-3.5 font-arcade text-xs text-black hover:bg-black hover:text-white"
                  >
                    ★ CONFIRM RESERVATION ★
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
