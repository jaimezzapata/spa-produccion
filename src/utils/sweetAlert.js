import Swal from 'sweetalert2'


export function redireccion(auth) {
    let timerInterval;
    Swal.fire({
        title: "Auto close alert!",
        html: "Será redireccionado en <h1></h1> milliseconds.",
        timer: 2000,
        icon: 'info',
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("h1");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
            auth('/reserva')
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
    });
}

export function errorRedireccion() {
    Swal.fire({
        title: "Error de credenciales",
        text: "Usuario y/o contraseña incorrecto o no existe",
        icon: "error"
    });
}