import type { Metadata } from "next";
import { ArrowDownToLine, ExternalLink, Rotate3D, ZoomIn } from "lucide-react";
import { EyewearViewer } from "@/components/eyewear-viewer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const modelUrl =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SunglassesKhronos/glTF-Binary/SunglassesKhronos.glb";

export const metadata: Metadata = {
  title: "Study Case Viewer 3D",
  description: "Contoh viewer model glTF interaktif dengan React Three Fiber.",
};

export default function ModelViewerStudyCasePage() {
  return (
    <main>
      <SiteHeader />
      <section className="study-case-page content-width">
        <div className="study-case-intro">
          <p className="section-kicker">STUDY CASE · REACT + TYPESCRIPT</p>
          <h1>Inspeksi model 3D di browser</h1>
          <p>
            Seret model untuk memutarnya, scroll untuk zoom, lalu lihat material
            dan bentuknya dari berbagai sudut. Viewer memakai file glTF Binary
            (.glb) melalui React Three Fiber.
          </p>
        </div>

        <div className="study-case-grid">
          <section className="study-case-viewer" aria-label="Viewer model 3D">
            <div className="study-case-viewer-canvas">
              <EyewearViewer
                src={modelUrl}
                tint="#ffffff"
                preserveMaterials
                minDistance={0.08}
                maxDistance={0.8}
                alt="Kacamata hitam Khronos yang dapat diputar dan di-zoom"
              />
              <span className="viewer-badge">
                <Rotate3D size={14} /> Model interaktif
              </span>
              <div className="viewer-help">
                Seret untuk memutar · scroll untuk zoom
              </div>
            </div>
            <div className="study-case-controls" aria-label="Kontrol viewer">
              <span>
                <Rotate3D size={15} /> Putar dengan mouse atau sentuhan
              </span>
              <span>
                <ZoomIn size={15} /> Scroll atau pinch untuk zoom
              </span>
            </div>
          </section>

          <aside className="study-case-info">
            <p className="section-kicker">MODEL DEMO</p>
            <h2>Sunglasses Khronos</h2>
            <p>
              Model kacamata sample dari Khronos Group, dibuat sebagai aset
              contoh e-commerce. Model ini berguna untuk mempelajari geometri,
              tekstur, material transparan, dan efek iridescent.
            </p>
            <dl>
              <div>
                <dt>Format</dt>
                <dd>glTF Binary (.glb)</dd>
              </div>
              <div>
                <dt>Interaksi</dt>
                <dd>Orbit, zoom, inertia</dd>
              </div>
              <div>
                <dt>Ukuran asli</dt>
                <dd>Sekitar 15 cm</dd>
              </div>
            </dl>
            <a
              className="button-primary study-case-download"
              href={modelUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowDownToLine size={15} /> Unduh file GLB
            </a>
            <a
              className="study-case-source"
              href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SunglassesKhronos"
              target="_blank"
              rel="noreferrer"
            >
              Lihat dokumentasi dan lisensi <ExternalLink size={13} />
            </a>
            <p className="study-case-attribution">
              Model dan tekstur oleh Eric Chadwick, © 2024 Darmstadt Graphics
              Group GmbH, berlisensi{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 4.0
              </a>
              . Logo Khronos dalam model merupakan merek dagang masing-masing
              pemiliknya.
            </p>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
