# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Force exact file copy with correct name
RUN cp /usr/lib/x86_64-linux-gnu/liblept.so.5 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
 && cp /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/libleptonica-1.82.0.so \
 && chmod 755 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so /app/libleptonica-1.82.0.so \
 && ldconfig \
 && ls -l /usr/lib/x86_64-linux-gnu/*lept* /app/*leptonica*

ENV LD_LIBRARY_PATH=/app:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

COPY --from=build /app/publish .

COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

COPY i2t-Api/Dictionaries /usr/share/hunspell

# Verify the library is resolvable before finalizing the image
RUN ldd /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
