import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { useLoaderData } from "react-router";

export function SearchPage() {
    const properties = useLoaderData();

    console.log(properties);


    return (
        <main className="max-w-6xl mx-auto p-6">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Résultats de recherche</h1>
                {/* <p className="text-gray-600 mt-2">
                    📍 Voyage pour <span className="font-semibold text-blue-600">{travelers} voyageur(s)</span> {dateDisplay}.
                </p> */}
            </header>
            {/* {properties.map((property:) => (
                <div></div>
            ))} */}

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-100 h-64 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Connexion à Laravel en cours...</p>
                </div>
            </section>
        </main>
    );
}