import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "~/data";

export const action = async ({params, request}: ActionFunctionArgs)=>{
    invariant(params.contactId,"Missing contactId params");
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`)
}

export const loader = async ({params}: LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing contactId params");
    const contact = await getContact(params.contactId);
    if(!contact){
        throw new Response("Not Found", {status: 404});
    }
    return json({contact})
}

export default function EditContact(){
    const {contact} = useLoaderData<typeof loader>();

    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input type="text" defaultValue={contact.first} aria-label="First Name" name="first" placeholder="First" />
                <input type="text" defaultValue={contact.last} aria-label="Last Name" name="last" placeholder="Last" />
            </p>
            <label>
                <span>Twitter</span>
                <input type="text" defaultValue={contact.twitter} name="twitter" placeholder="@jack" />
            </label>
            <label>
                <span>Avatar URL</span>
                <input type="text" aria-label="Avatar URL" defaultValue={contact.avatar} name="avatar" placeholder="http://example.com/avatar.jpg" />
            </label>
            <label>
                <span>Notes</span>
                <textarea name="notes" rows={6} defaultValue={contact.notes}/>
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button">Cancel</button>
            </p>
        </Form>
    )
}