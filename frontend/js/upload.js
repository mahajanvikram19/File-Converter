const UP_API = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", () => {

    const uploadForm = document.querySelector("#uploadForm");

    if (uploadForm) {
        uploadForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fileInput = document.querySelector("#fileInput");
            const targetFormat = document.querySelector("#targetFormat");

            if (!fileInput.files.length) {
                alert("Please select a file");
                return;
            }

            const formData = new FormData();
            formData.append("file", fileInput.files[0]);
            formData.append("target", targetFormat.value);

            let headers = {};
            let token = getToken();
            if (token) {
                headers["Authorization"] = "Bearer " + token;
            }

            const res = await fetch(`${UP_API}/api/conversion/upload`, {
                method: "POST",
                headers,
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                document.querySelector("#downloadLink").innerHTML =
                    `<a href="${UP_API}${data.downloadUrl}" download>Download File</a>`;
            } else {
                alert(data.message);
            }

        });
    }

});