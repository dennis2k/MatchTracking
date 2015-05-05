<?php
class FileUpload   {

    private $name, $type, $tmp_name, $error, $size, $path, $context;

    public function __construct($context){
        $this->context = $context;
    }

    /**
     * Load the file into the object
     * @param $file
     */
    public function load($file)
    {
        $this->name = $file['name'];
        $this->type = $file['type'];
        $this->tmp_name = $file['tmp_name'];
        $this->error = $file['error'];
        $this->size = $file['size'];
        $this->handleError();
    }

    /**
     * Move the file to a destination
     * @param $destination
     * @throws Exception
     */
    public function move($destination) {
        if ($this->error == UPLOAD_ERR_OK) {
            $this->path = $destination . DIRECTORY_SEPARATOR . $this->name;
            $isUploaded = move_uploaded_file($this->tmp_name, $this->path);
            if($isUploaded == false)
                throw new Exception("Unable to move file to $destination");
        }
        else
            throw new Exception("Moving error: " . $this->error);
    }

    public function getPath()
    {
        return "asserts/img/{$this->context}/{$this->name}";
    }

    /**
     * Check for errors
     * @throws Exception
     */
    private function handleError() {
        switch($this->error) {
            case UPLOAD_ERR_CANT_WRITE:
                throw new Exception("Error write file to disk");
                break;
            case UPLOAD_ERR_EXTENSION:
                throw new Exception("Error resolving file extension");
                break;
            case UPLOAD_ERR_FORM_SIZE:
                throw new Exception("Form size error");
                break;
            case UPLOAD_ERR_INI_SIZE:
                throw new Exception("Initial size error");
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new Exception("No file error");
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                throw new Exception("No temp dir");
                break;
            case UPLOAD_ERR_PARTIAL:
                throw new Exception("Only part of the file was uploaded");
                break;
        }
    }
}