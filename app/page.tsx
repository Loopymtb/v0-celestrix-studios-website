"use client"

import type React from "react"

import { useEffect, useRef, useState, Suspense } from "react"
import Image from "next/image"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere, MeshDistortMaterial, Stars } from "@react-three/drei"
import type * as THREE from "three"

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.5}>
        <MeshDistortMaterial
          color="#a855f7"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function FilmReel() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshStandardMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI) / 3) * 1, Math.sin((i * Math.PI) / 3) * 1, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#a855f7" />
        </mesh>
      ))}
    </group>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ec4899" transparent opacity={0.6} />
    </points>
  )
}

export default function CelestrixStudios() {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const filmsRef = useRef<HTMLElement>(null)
  const applyRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      const sections = [
        { id: "hero", ref: heroRef },
        { id: "about", ref: aboutRef },
        { id: "services", ref: servicesRef },
        { id: "films", ref: filmsRef },
        { id: "apply", ref: applyRef },
        { id: "contact", ref: contactRef },
      ]

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Backdrop with gradient border */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl border-b-2 border-transparent bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 relative z-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <button
              onClick={() => scrollToSection(heroRef)}
              className="relative h-8 w-36 md:h-10 md:w-52 opacity-90 hover:opacity-100 transition-opacity group"
            >
              <Image
                src="/images/design-mode/CelestrixStudiosLong.png"
                alt="Celestrix Studios"
                fill
                className="object-contain object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {/* Regular nav items */}
              <div className="flex items-center gap-1">
                {[
                  { name: "ABOUT", ref: aboutRef, id: "about" },
                  { name: "SERVICES", ref: servicesRef, id: "services" },
                  // Added "FILMS" to the desktop menu
                  { name: "FILMS", ref: filmsRef, id: "films" },
                  { name: "APPLY", ref: applyRef, id: "apply" },
                  { name: "CONTACT", ref: contactRef, id: "contact" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.ref)}
                    className="relative px-4 py-2 text-xs font-mono tracking-wider group overflow-hidden"
                  >
                    {/* Background glow on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Text */}
                    <span
                      className={`relative z-10 transition-colors ${
                        activeSection === item.id ? "text-pink-400" : "text-gray-400 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Active indicator */}
                    {activeSection === item.id && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent mx-2" />

              {/* Our Films CTA Button - Prominent and largest */}
              <a href="/films" className="relative group px-6 py-2.5 overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] animate-gradient" />

                {/* Border glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity" />

                {/* Button content */}
                <div className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  <span className="text-sm font-bold tracking-wider text-white">OUR FILMS</span>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/50" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 relative group"
              aria-label="Toggle menu"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity" />
              <span
                className={`relative w-6 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`relative w-6 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`relative w-6 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden relative transition-all duration-300 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl border-t border-purple-500/30" />
          <div className="relative z-10 px-4 py-6 space-y-1 font-mono">
            {/* Our Films button for mobile */}
            <a
              href="/films"
              className="block w-full py-3 px-4 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-bold tracking-wider border-2 border-pink-500/50"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                OUR FILMS
              </div>
            </a>

            {[
              { name: "ABOUT", ref: aboutRef },
              { name: "SERVICES", ref: servicesRef },
              // Added "FILMS" to the mobile menu
              { name: "FILMS", ref: filmsRef },
              { name: "APPLY", ref: applyRef },
              { name: "CONTACT", ref: contactRef },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.ref)}
                className="block w-full text-left py-3 px-4 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 hover:text-pink-400 transition-all tracking-wider text-gray-300 border-l-2 border-transparent hover:border-pink-500"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section - Added 3D Canvas background with animated sphere */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden px-4">
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-40">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
              <AnimatedSphere />
              <FloatingParticles />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Suspense>
          </Canvas>
        </div>

        {/* Animated Background Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            backgroundImage: `
              linear-gradient(rgba(236,72,153,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168,85,247,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 text-center w-full">
          <div className="relative w-full max-w-[600px] sm:max-w-[900px] md:max-w-[1400px] lg:max-w-[1800px] h-28 sm:h-40 md:h-56 lg:h-72 mx-auto mb-6 md:mb-8 animate-fade-in">
            <Image
              src="/images/design-mode/CelestrixWide.png"
              alt="Celestrix Studios"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(236,72,153,0.5)] opacity-100"
              priority
            />
          </div>
          <p className="text-sm sm:text-lg md:text-2xl font-light tracking-[0.2em] md:tracking-[0.3em] text-gray-300 mb-3 md:mb-4 animate-fade-in px-4">
            STUDIO ON THE GO
          </p>
          <p className="text-xs sm:text-base md:text-lg font-mono text-purple-400 animate-fade-in-delay px-4">
            // Your Story Starts Here
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-pink-500 rounded-full flex justify-center pt-1.5 md:pt-2">
            <div className="w-1 h-1.5 md:h-2 bg-pink-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section - Simplified layout and replaced 3D donut with real team photo */}
      <section ref={aboutRef} className="min-h-screen relative py-16 md:py-32 px-4 md:px-6 overflow-hidden">
        {/* Film Strip Border Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-purple-900/40 to-transparent">
          <div className="absolute inset-0 flex flex-col justify-around py-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-4 md:h-6 bg-black/60 border-l-2 border-r-2 border-pink-500/30" />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-purple-900/40 to-transparent">
          <div className="absolute inset-0 flex flex-col justify-around py-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-4 md:h-6 bg-black/60 border-l-2 border-r-2 border-pink-500/30" />
            ))}
          </div>
        </div>

        {/* Animated Scanlines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-scan" />
        </div>

        {/* Lens Flare Effect */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Replaced 3D canvas with real team photo */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden border-2 border-purple-500/30">
                <Image
                  src="/images/design-mode/IMG_0495.JPG.jpeg"
                  alt="Celestrix Studios Team Filming"
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Decorative number badge */}
              <div className="absolute -bottom-6 -right-6 bg-black border-2 border-pink-500 p-6 md:p-8">
                <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-600">
                  01
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6 md:space-y-8">
              <div className="text-sm font-mono text-purple-400 tracking-widest">// SECTION 01</div>

              <h2 className="text-4xl md:text-6xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  About Us
                </span>
              </h2>

              <div className="space-y-4 md:space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
                <p className="border-l-2 border-pink-500 pl-4 md:pl-6">
                  Celestrix Studios is a global, creator driven film company founded by Charles Gardner in New Mexico.
                  We&#39;re a &quot;studio on the go&quot; that gives filmmakers and artists from anywhere in the world
                  the chance to join our creative collective by sharing their work.
                </p>
                <p className="border-l-2 border-purple-500 pl-4 md:pl-6">
                  We believe people&#39;s talent shouldn&#39;t be limited by expensive film schools or geographic
                  boundaries. At Celestrix, creators can grow their skills, get featured, and earn real opportunities to
                  build their careers in film and media all on their own terms.
                </p>
                <p className="border-l-2 border-pink-500 pl-4 md:pl-6">
                  Our mission is to democratize filmmaking and create a platform where passion, creativity, and
                  dedication are the only requirements. Join us in redefining what it means to be a filmmaker in the
                  digital age.
                </p>
              </div>

              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-8">
                {[
                  { label: "Global", description: "Creators" },
                  { label: "No Barriers", description: "To Entry" },
                  { label: "Real", description: "Opportunities" },
                ].map((value, i) => (
                  <div
                    key={i}
                    className="text-center p-4 md:p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-pink-500/40 transition-colors"
                  >
                    <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      {value.label}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 mt-2 font-mono">{value.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={servicesRef} className="min-h-screen py-16 md:py-32 px-4 md:px-6 relative overflow-hidden">
        {/* Diagonal split background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-black to-pink-950/40" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent transform -skew-y-12" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-pink-500/20 to-transparent transform skew-y-12" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-20 gap-6">
            <div>
              <div className="text-sm font-mono text-purple-400 mb-4 tracking-widest">// SECTION 02</div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  What We
                </span>
                <br />
                <span className="text-white">Create</span>
              </h2>
            </div>
            <div className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
              From cinematic storytelling to live production, we bring your vision to life with creativity and technical
              excellence.
            </div>
          </div>

          {/* Asymmetric Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Large Featured Card - Short Films */}
            <div className="lg:col-span-7 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-500" />
              <div className="absolute inset-0 border-2 border-purple-500/30 group-hover:border-pink-500/50 transition-all duration-500" />

              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-pink-500" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-purple-500" />

              <div className="absolute bottom-0 right-0 w-full h-32 sm:h-48 md:h-64 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
                <Image
                  src="/images/design-mode/maneken-CARGO04.jpg"
                  alt="Celestrix Studios Production Truck"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              <div className="relative p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 border-2 border-pink-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                    <div className="text-7xl font-bold text-purple-500/20">01</div>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Short Films
                  </h3>

                  <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
                    We tell stories that move people. Our team handles everything from concept to final cut, blending
                    cinematic visuals with creativity that captures attention.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 relative z-10">
                  {["Narrative Films", "Documentaries", "Student Projects"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-black/80 border border-purple-500/30 text-sm font-mono text-purple-300 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stacked Cards - Live Streaming & Ads */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8">
              {/* Live Streaming Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 group-hover:from-pink-600/30 group-hover:to-purple-600/30 transition-all duration-500" />
                <div className="absolute inset-0 border-2 border-pink-500/30 group-hover:border-purple-500/50 transition-all duration-500" />

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/20 to-transparent" />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 border-2 border-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-5xl font-bold text-pink-500/20">02</div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
                    Live Streaming
                  </h3>

                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                    Professional live streaming for events, gaming, concerts, and more. High quality streams that engage
                    your audience.
                  </p>

                  <div className="space-y-2 text-sm text-gray-400 font-mono">
                    {["Events & Conferences", "Gaming & Esports", "Live Performances"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ads & Commercials Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-500" />
                <div className="absolute inset-0 border-2 border-purple-500/30 group-hover:border-pink-500/50 transition-all duration-500" />

                {/* Corner accent */}
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent" />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 border-2 border-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <div className="text-5xl font-bold text-purple-500/20">03</div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Ads & Commercials
                  </h3>

                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                    We make ads that stand out. No matter your business size, we help you reach people through visuals
                    that tell a story.
                  </p>

                  <div className="space-y-2 text-sm text-gray-400 font-mono">
                    {["Social Media Ads", "Product Commercials", "Brand Videos"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 md:mt-24 text-center">
            <div className="inline-block relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <button
                onClick={() => scrollToSection(contactRef)}
                className="relative px-8 md:px-12 py-4 md:py-5 bg-black border-2 border-purple-500 hover:border-pink-500 text-white text-sm md:text-base font-bold tracking-widest transition-all duration-300 group-hover:scale-105"
              >
                <span className="relative z-10">START YOUR PROJECT</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
      </div>

      <section ref={filmsRef} className="min-h-screen py-16 md:py-32 px-4 md:px-6 relative overflow-hidden">
        {/* Cinematic background with film reel pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-pink-950/20 to-black" />

        {/* Film strip decoration on sides */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 opacity-20">
          <div className="h-full flex flex-col justify-around">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="h-8 bg-purple-500/30 border-y-2 border-pink-500/50" />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 opacity-20">
          <div className="h-full flex flex-col justify-around">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="h-8 bg-purple-500/30 border-y-2 border-pink-500/50" />
            ))}
          </div>
        </div>

        {/* Spotlight effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="text-sm font-mono text-purple-400 mb-4 tracking-widest">// SECTION 03</div>
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400/20 to-pink-600/20 mb-8">
              03
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Our Films
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Showcasing the creative work of our global community of filmmakers
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl" />

            <div className="relative bg-black border-2 border-purple-500/50 p-12 md:p-20">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-pink-500" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-pink-500" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-purple-500" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-purple-500" />

              <div className="text-center space-y-8">
                {/* Film icon */}
                <div className="flex justify-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 border-4 border-purple-500/50 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 md:w-16 md:h-16 text-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                    {/* Animated glow */}
                    <div className="absolute inset-0 border-4 border-pink-500/50 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Explore Our Films
                  </h3>
                  <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
                    Discover the incredible work from our talented creators around the world. Watch our latest short
                    films, documentaries, and creative projects.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-8">
                  <div className="relative inline-block group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <a
                      href="/films"
                      className="relative block px-12 md:px-16 py-5 md:py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg md:text-xl font-bold tracking-widest transition-all duration-300 group-hover:scale-105"
                    >
                      <div className="flex items-center gap-3 justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                        <span>VIEW OUR FILMS</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="flex justify-center gap-2 pt-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <section ref={applyRef} className="min-h-screen relative flex items-center py-16 md:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/50 to-black" />

        {/* Diagonal light beam effect */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent transform skew-x-12" />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-pink-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-sm font-mono text-pink-400 tracking-widest">// SECTION 04</div>
                <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400/30 to-pink-600/30 leading-none">
                  04
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Join The
                </span>
                <br />
                <span className="text-white">Movement</span>
              </h2>

              <div className="space-y-6">
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Ready to take your filmmaking career to the next level?
                </p>
                <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl">
                  Apply to join Celestrix Studios and become part of our global creative collective. No expensive film
                  school required, all you need is passion, creativity, and dedication.
                </p>
              </div>

              {/* Feature highlights with icons */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                {[
                  { icon: "🌍", label: "Work From", value: "Anywhere" },
                  { icon: "📽️", label: "Build Your", value: "Portfolio" },
                  { icon: "🚀", label: "Real", value: "Opportunities" },
                  { icon: "🎓", label: "No School", value: "Required" },
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all" />
                    <div className="absolute inset-0 border border-purple-500/30 group-hover:border-pink-500/50 transition-all" />
                    <div className="relative p-6 text-center">
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                      <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - CTA Card */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-3xl" />

              <div className="relative">
                {/* Main card */}
                <div className="relative bg-black border-2 border-purple-500/50 p-8 md:p-12">
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-500" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-pink-500" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500" />

                  <div className="space-y-8">
                    <div className="text-center space-y-4">
                      <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Ready to Apply?
                      </h3>
                      <p className="text-gray-400 text-sm md:text-base">
                        Submit your application and join creators from around the world who are building their careers
                        with Celestrix Studios.
                      </p>
                    </div>

                    {/* Application stats */}
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-purple-500/30">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                          1-2
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Weeks Response</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                          100%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Reviewed</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                      <a
                        href="/apply"
                        className="relative block w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-center text-lg font-bold tracking-widest transition-all duration-300 group-hover:scale-105"
                      >
                        APPLY NOW
                      </a>
                    </div>

                    <p className="text-xs text-center text-gray-500 font-mono">
                      All applications are carefully reviewed by our team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-950/20 to-black" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
      </div>

      <section ref={contactRef} className="min-h-screen relative flex items-center py-16 md:py-32 overflow-hidden">
        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl" />

        {/* Stage Lights */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-500" />
        <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side */}
            <div>
              <div className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400/20 to-pink-600/20 mb-6 md:mb-8">
                05
              </div>
              <h2 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Let's Create
                </span>
                <br />
                <span className="text-white">Together</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6 md:mb-8">
                Ready to bring your vision to life? We're always looking for exciting new projects and creative
                collaborations.
              </p>

              {/* Contact Info - Updated email and phone number */}
              <div className="space-y-4 mb-8 md:mb-12">
                <div className="flex items-center gap-4 text-gray-300 hover:text-pink-400 transition-colors">
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-purple-500/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-mono text-sm md:text-base break-all">Celestrixstudios@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300 hover:text-pink-400 transition-colors">
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-purple-500/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <span className="font-mono text-sm md:text-base">(505) 363-7329</span>
                </div>
              </div>
            </div>

            {/* Right Side - Social Links - Added proper links for Instagram and YouTube, coming soon alerts for Facebook and TikTok */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-purple-600/10 to-pink-600/10 blur-3xl" />
              <div className="relative bg-black border border-purple-500/30 p-6 md:p-12">
                <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Connect With Us
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {[
                    {
                      name: "Instagram",
                      handle: "@celestrixstudios",
                      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.204-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z",
                      href: "https://www.instagram.com/celestrixstudios",
                    },
                    {
                      name: "YouTube",
                      handle: "celestrixstudios",
                      icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                      href: "https://www.youtube.com/@CelestrixStudios",
                    },
                    {
                      name: "TikTok",
                      handle: "@celestrixstudios",
                      icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
                      comingSoon: true,
                    },
                    {
                      name: "Facebook",
                      handle: "celestrixstudios",
                      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                      comingSoon: true,
                    },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href || "#"}
                      onClick={(e) => {
                        if (social.comingSoon) {
                          e.preventDefault()
                          alert("Coming soon!")
                        }
                      }}
                      target={social.href ? "_blank" : undefined}
                      rel={social.href ? "noopener noreferrer" : undefined}
                      className="flex items-center justify-between p-3 md:p-4 border border-purple-500/30 hover:border-pink-500 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-pink-900/20 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 text-purple-400 group-hover:text-pink-400 transition-colors flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d={social.icon} />
                        </svg>
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm md:text-base">{social.name}</div>
                          <div className="text-xs md:text-sm text-gray-400 font-mono truncate">{social.handle}</div>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-pink-400 transform group-hover:translate-x-2 transition-transform flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Made responsive with stacked layout on mobile */}
      <footer className="border-t border-purple-500/30 py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="text-gray-500 font-mono text-xs md:text-sm text-center md:text-left">
            © 2025 Celestrix Studios. All rights reserved.
          </div>
          <div className="flex gap-6 md:gap-8 text-xs md:text-sm text-gray-500 font-mono">
            <a href="#" className="hover:text-pink-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              Careers
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
