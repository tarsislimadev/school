package main

import (
	"net/http"
	"strings"
	"regexp"
	"time"
	"fmt"
	"os"
)

type Database struct {
	Path string
}

type DataObject struct {
	IndexPath string
	Id string
}

func (db *Database) Root (path string) error {
	db.Path = db.Path + "/" + path
	return mkdirRecusrsive(db.Path)
}

func (db Database) newData () DataObject {
	Name := uuid()

	err := mkdirRecusrsive(db.Path + "/" + Name)
	check(err)

	return DataObject{
		IndexPath: db.Path,
		Id: Name,
	}
}

func (do *DataObject) Name () string {
	return do.IndexPath + "/" + do.Id
}

func (do *DataObject) FullName (prop string) string {
	return do.Name() + "/" + prop
}

func (do *DataObject) Write (prop string, content []byte) error {
	file, err := os.Create(do.FullName(prop))
	if (err != nil) { return err }
	defer file.Close()

	file.Write(content)
	return nil
}

func (do *DataObject) WriteMany (bytesMap map[string][]byte) error {

	for prop, content := range bytesMap {
		if err := do.Write(prop, content); err != nil { return err }
	}

	return nil
}

func mkdirRecusrsive(path string) error {
	return os.MkdirAll(path, os.ModePerm)
}

var fileDB = Database{}

func check (err error) {
	if err != nil { panic(err) }
}

func uuid () (string) {  // FIXME: uuid
	now := regexp.MustCompile(`\w`).FindAllString(time.Now().String(), -1)
	return string(strings.Join(now[:22], ""))
}

func readFileFromRequest (r *http.Request) []byte {
	r.ParseMultipartForm(32 << 20)

	file, headers, err := r.FormFile("file")
	check(err)
	defer file.Close()

	buff := make([]byte, headers.Size)
	_, err = file.Read(buff)
	check(err)

	return buff
}

type Upload struct {
	Id []byte
	File []byte
	Name []byte
	Size []byte
	Type []byte
}

func (u Upload) toStringMap () (map[string][]byte) {
	return map[string][]byte{
		"id": u.Id,
		"file": u.File,
		"name": u.Name,
		"size": u.Size,
		"type": u.Type,
	}
}

func (u Upload) toJSON () (string) {
	return fmt.Sprintf(
		"{\"id\":\"%s\",\"name\":\"%s\",\"size\":\"%s\",\"type\":\"%s\"}",
		u.Id,
		u.Name,
		u.Size,
		u.Type,
	)
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {

	obj := fileDB.newData()

	upload := Upload{
		Id: []byte(obj.Id),
		File: readFileFromRequest(r),
		Name: []byte(r.Form["name"][0]),
		Size: []byte(r.Form["size"][0]),
		Type: []byte(r.Form["type"][0]),
	}

	obj.WriteMany(upload.toStringMap())

	fmt.Fprintf(w, "{\"status\":\"ok\", \"message\":null, \"data\":%s}", upload.toJSON())
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "text/html")
	http.ServeFile(w, r, "index.html")
}

func main() {
	err := fileDB.Root(os.Getenv("DATA_PATH"))
	check(err)

	http.HandleFunc("/api/v1/upload", uploadHandler)
	http.ListenAndServe(":80", nil)
}
