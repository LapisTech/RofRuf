/// <reference path="./App.ts" />



document.addEventListener( 'DOMContentLoaded', () =>
{
	const app = new App(
	{
		popup: <Popup>document.getElementById( 'popup' ),
		dialog: <Dialog>document.getElementById( 'dialog' ),
		message: <Message>document.getElementById( 'message' ),
		main: <HTMLElement>document.getElementById( 'main' ),
		egg: <HTMLElement>document.getElementById( 'egg' ),
	} );
} );
