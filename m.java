JOptionPane.showMessageDialog(null, "Connecting...");

try{

    URL url = new URL(Txt_url.getText());

    HttpURLConnection con = (HttpURLConnection) url.openConnection();

    JOptionPane.showMessageDialog(null, "Server Response. Response Code : "+con.getResponseCode());

    BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));

    String line;

while((line = in.readLine())!= null)

    Txt_response.append(line+"\n");

    in.close();

    con.disconnect();

}catch(Exception e){

    System.err.println(e);

}




 

ini post

 

String data = txt_data.getText(); // Isi JSON dari textarea

String urlStr = txt_url.getText(); // URL dari textbox, misal: https://jsonplaceholder.typicode.com/posts

 

JOptionPane.showConfirmDialog(null, "Connecting...");

 

try {

    URL url = new URL(urlStr);

    HttpURLConnection con = (HttpURLConnection) url.openConnection();

    

    con.setRequestMethod("POST");

    con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

    con.setDoOutput(true);

    con.setDoInput(true);

 

    // Kirim data JSON

    OutputStreamWriter out = new OutputStreamWriter(con.getOutputStream(), "UTF-8");

    out.write(data);

    out.flush();

    out.close();

 

    // Baca respons

    BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));

    String line;

    txt_response.setText(""); // Reset dulu isi response

    while ((line = in.readLine()) != null) {

        txt_response.append(line + "\n");

    }

    in.close();

 

    con.disconnect();

    JOptionPane.showMessageDialog(null, "Data berhasil dikirim!");

 

} catch (Exception e) {

    JOptionPane.showMessageDialog(null, "Error: " + e.getMessage());

    e.printStackTrace();

}

 

 

 

{
"title" : "Mulyono Anak Baik",
"body": "Hidup Mulyonooooo...!!!",
"userId": 1
}