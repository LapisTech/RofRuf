function Fetch( input: RequestInfo, init?: RequestInit )
{
	return fetch( input, init ).then( ( result ) =>
	{
		if ( result.ok ) { return result; }
		throw result;
	} );
}

function GetJson<T>( input: RequestInfo )
{
	return fetch( input ).then( ( result ) =>
	{
		if ( result.ok ) { return <Promise<T>>result.json(); }
		throw result.json();
	} );
}

function PostJson<T>( input: RequestInfo, data: any )
{
	const header = { Accept: 'application/json', 'Content-Type': 'application/json' };
	const body = JSON.stringify( data );
	return fetch( input, { method: 'POST', headers: header, body: body } ).then( ( result ) =>
	{
		if ( result.ok ) { return <Promise<T>>result.json(); }
		throw result.json();
	} );
}
