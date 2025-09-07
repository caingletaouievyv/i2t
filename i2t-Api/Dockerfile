FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Create symlink for .NET expected filename
RUN ln -sf /usr/lib/x86_64-linux-gnu/liblept.so.5 \
           /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so

ENV LD_LIBRARY_PATH=/app:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

COPY --from=build /app/publish .

# Place a copy in /app too (InteropDotNet probes here first)
RUN cp -f /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/libleptonica-1.82.0.so \
 && ldconfig

COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
