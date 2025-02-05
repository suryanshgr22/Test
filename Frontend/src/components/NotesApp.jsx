import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    fetchNotes();
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechAPI();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";
      speechRecognition.onresult = (event) => {
        setNewNote(event.results[0][0].transcript);
      };
      setRecognition(speechRecognition);
    }
  }, []);

  const fetchNotes = async () => {
    // Fetch notes from API (placeholder for now)
    const data = [
      { id: 1, title: "Meeting Notes", content: "Discuss project roadmap." },
      { id: 2, title: "Grocery List", content: "Milk, eggs, bread." },
    ];
    setNotes(data);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const newNotes = [...notes, { id: Date.now(), title: "New Note", content: newNote }];
    setNotes(newNotes);
    setNewNote("");
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleRenameNote = (id, newTitle) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, title: newTitle } : note)));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const startRecording = () => {
    if (recognition) {
      setRecording(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      setRecording(false);
      recognition.stop();
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Input placeholder="Search notes..." value={search} onChange={handleSearch} className="mb-4" />
      <div className="grid gap-4">
        {notes
          .filter((note) => note.title.toLowerCase().includes(search.toLowerCase()) || note.content.toLowerCase().includes(search.toLowerCase()))
          .map((note) => (
            <Card key={note.id} onClick={() => setSelectedNote(note)} className="cursor-pointer">
              <CardContent>
                <h2 className="font-bold">{note.title}</h2>
                <p>{note.content.substring(0, 50)}...</p>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="mt-4">
        <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="New note..." />
        <Button onClick={handleAddNote} className="ml-2">Add Note</Button>
        <Button onClick={startRecording} disabled={recording} className="ml-2">🎤 Record</Button>
        <Button onClick={stopRecording} disabled={!recording} className="ml-2">⏹ Stop</Button>
      </div>
      {selectedNote && (
        <Dialog open={Boolean(selectedNote)} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent>
            <DialogTitle>{selectedNote.title}</DialogTitle>
            <p>{selectedNote.content}</p>
            <Button onClick={() => handleDeleteNote(selectedNote.id)} className="mt-4">Delete</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NotesApp;
