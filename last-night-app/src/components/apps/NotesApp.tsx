import { useEffect, useState } from "react"
import { useGlobal } from "../../GlobalContextHandler";
import { t } from "../../strings/i18n";

export default function NotesApp() {
    
    const G = useGlobal()
    const [page, setPage] = useState(0);
    const [notes, setNotes] = G.notes;
    const [currentText, setCurrentText] = useState(notes[0] ?? "");
    const [currentApp, setCurrentApp] = G.currentApp;
    const MAX_PAGES = 5;
    
    useEffect(() => {
        notes[page] = currentText;
        setNotes([...notes]);
    }, [currentText]);

    useEffect(() => {
        setCurrentText(notes[page] ?? "");
    }, [page])

    function incrementPage(n: number) {
        setPage((page + n + MAX_PAGES) % MAX_PAGES);
    }
    
    return (
        <>
            <header>
                <h1>
                    {t(`app.notes`)}
                </h1>
                <div className="page-number">
                    <button className="page-button" onClick={() => incrementPage(-1)}>
                        <img src="assets/img/ui/icon-caret-left.png" alt="page back icon" />

                    </button>
                    <h2 className="pageNumber">
                        {page + 1}
                    </h2>
                    <button className="page-button" onClick={() => incrementPage(1)}>
                        <img src="assets/img/ui/icon-caret-right.png" alt="page forward icon" />
                    </button>
                </div>
                <button className="home-button" onClick={() => setCurrentApp(null)}>
                   <img src="assets/img/ui/icon-home.png" alt="home icon" />
                </button>
            </header>
            <main>
                <div className="textarea-wrapper">
                    <textarea name="" id="" spellCheck={false} 
                        value={currentText} 
                        onChange={(e) => setCurrentText(e.target.value)} 
                    >

                    </textarea>
                </div>
            </main>
        </>
    )
}