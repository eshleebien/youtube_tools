<?php
function generateCsv($data, $delimiter = ',', $enclosure = '"') {
	   $contents = "";
       $handle = fopen('php://temp', 'r+');
       //foreach ($data as $line) {
               fputcsv($handle,$data, $delimiter, $enclosure);
       //}
       rewind($handle);
       while (!feof($handle)) {
               $contents .= fread($handle, 8192);
       }
       fclose($handle);
       return $contents;
}
?>